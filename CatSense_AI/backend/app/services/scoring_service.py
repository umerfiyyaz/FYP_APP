"""Rule-based health-risk scoring and the per-cat baseline. No ML here: plain, explainable rules."""
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db.models import Analysis, Baseline, Cat
from app.db.models.behavior_segment import BEHAVIORS
from app.services.behavior_service import behavior_shares
from app.services.risk_service import NEGATIVE_MOODS

BASELINE_CLIPS = 3
SOUND_PENALTY = 30
DEVIATION_WEIGHT = 70  # a completely different day scores up to 70


def compute_risk(cat: Cat, shares: dict[str, float], mood: str | None) -> tuple[str, int, dict]:
    """Score 0..100 = how far the clip is from the cat's own baseline (0..70) + 30 for distressed sound."""
    base = cat.baseline.metrics if cat.baseline and cat.baseline.metrics else None
    if base:
        deviation = 0.5 * sum(abs(shares.get(b, 0.0) - base.get(b, 0.0)) for b in BEHAVIORS)
    else:
        deviation = 0.0  # no baseline yet: nothing to compare with
    negative = bool(mood) and mood.lower() in NEGATIVE_MOODS
    score = round(deviation * DEVIATION_WEIGHT + (SOUND_PENALTY if negative else 0))
    level = "High" if score >= 60 else "Medium" if score >= 30 else "Low"
    reasons = {
        "deviation": round(deviation, 2),
        "negative_sound": negative,
        "has_baseline": base is not None,
        "rule": "deviation*70 + 30 if distressed sound",
    }
    return level, score, reasons


def update_baseline(db: Session, cat: Cat) -> None:
    """Baseline = average behavior shares of the cat's first 3 finished analyses."""
    first = db.scalars(
        select(Analysis)
        .where(Analysis.cat_id == cat.id, Analysis.status == "done")
        .options(selectinload(Analysis.segments))
        .order_by(Analysis.created_at)
        .limit(BASELINE_CLIPS)
    ).all()
    if not first:
        return
    all_shares = [behavior_shares(a) for a in first]
    metrics = {b: round(sum(s.get(b, 0.0) for s in all_shares) / len(all_shares), 4) for b in BEHAVIORS}
    baseline = cat.baseline or Baseline(cat=cat)
    baseline.metrics = metrics
    db.add(baseline)