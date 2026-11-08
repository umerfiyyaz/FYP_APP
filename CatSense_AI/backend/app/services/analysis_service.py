from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.db.models import Alert, Analysis, BehaviorSegment, RiskScore, SoundResult
from app.ml.pipeline import PipelineResult
from app.services import scoring_service
from app.services.risk_service import NEGATIVE_MOODS


def _shares(result: PipelineResult) -> dict[str, float]:
    totals: dict[str, float] = {}
    for s in result.segments:
        totals[s.behavior] = totals.get(s.behavior, 0.0) + max(s.end_s - s.start_s, 0.0)
    whole = sum(totals.values())
    return {b: t / whole for b, t in totals.items()} if whole > 0 else {}


def make_headline(shares: dict[str, float], mood: str | None) -> str:
    if mood and mood.lower() in NEGATIVE_MOODS:
        return "Needs a closer look"
    top = max(shares, key=shares.get) if shares else "Resting"
    return {
        "Resting": "Calm & Content",
        "Eating": "Normal meal",
        "Grooming": "Relaxed grooming",
        "Moving": "Active & Moving",
        "Standing": "Alert & Watching",
    }[top]


def save_result(db: Session, analysis: Analysis, result: PipelineResult) -> None:
    """Store everything the pipeline found, score it, and raise an alert when needed."""
    now = datetime.now(timezone.utc)
    analysis.model_versions = result.model_versions

    if not result.found_cat:
        analysis.status, analysis.progress, analysis.stage, analysis.finished_at = "no_cat", 100, "finding_cat", now
        db.commit()
        return

    cat = analysis.cat
    for s in result.segments:
        analysis.segments.append(
            BehaviorSegment(start_s=s.start_s, end_s=s.end_s, behavior=s.behavior, confidence=s.confidence)
        )
    analysis.sound = SoundResult(
        mood=result.sound_mood, confidence=result.sound_confidence, breakdown=result.sound_breakdown,
        waveform=result.sound_waveform,
    )
    if analysis.video:
        analysis.video.duration_s = result.duration_s

    shares = _shares(result)
    level, score, reasons = scoring_service.compute_risk(cat, shares, result.sound_mood)  # uses the OLD baseline
    analysis.risk = RiskScore(level=level, score=score, reasons=reasons)
    analysis.headline = make_headline(shares, result.sound_mood)
    analysis.status, analysis.progress, analysis.stage, analysis.finished_at = "done", 100, "health_report", now
    db.flush()

    scoring_service.update_baseline(db, cat)  # this clip now counts towards the baseline

    if level in ("High", "Medium"):
        high = level == "High"
        db.add(Alert(
            cat_id=cat.id,
            analysis_id=analysis.id,
            level="high" if high else "medium",
            title="Unusual activity pattern" if high else "Changes from the usual pattern",
            detail=(f"{cat.name} showed changes worth a closer look. Consider a vet check if it repeats."
                    if high else f"{cat.name} showed some changes from the usual pattern. Worth keeping an eye on."),
            emphasis="Consider a vet check if it repeats" if high else None,
            source="Video analysis",
            duration_sec=result.duration_s,
            status="open",
        ))
    db.commit()