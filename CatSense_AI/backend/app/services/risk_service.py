from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db.models import Analysis, Cat
from app.schemas.analysis import BaselineRow, Factor, RiskReport
from app.services.behavior_service import behavior_shares

BASELINE_TARGET = 3
# A behavior counts as "usual" if its share of the clip is within 20 percentage points of the cat's baseline.
TOLERANCE = 0.20
# Sound moods that make the sound factor "not ok". Update when the final sound labels are decided.
NEGATIVE_MOODS = {"stressed", "defensive", "pain", "in pain", "distressed", "angry", "fearful"}

SUMMARY = {
    "Low": "{name} shows well-regulated daily rhythms with stable comfort indicators.",
    "Medium": "{name} showed some changes compared with the usual pattern. Worth keeping an eye on.",
    "High": "{name} showed changes that are worth a closer look. Consider a vet check if it repeats.",
}


def _delta(share: float, base: float | None) -> int | None:
    if not base or base <= 0:
        return None
    return round((share - base) / base * 100) or None


def _within(share: float, base: float | None) -> bool:
    return base is None or abs(share - base) <= TOLERANCE


def build_risk_report(db: Session, analysis: Analysis, cat: Cat) -> RiskReport:
    shares = behavior_shares(analysis)
    metrics = (cat.baseline.metrics if cat.baseline and cat.baseline.metrics else {}) or {}
    rest, eat, move = (shares.get(k, 0.0) for k in ("Resting", "Eating", "Moving"))
    rest_ok = _within(rest, metrics.get("Resting"))
    eat_ok = _within(eat, metrics.get("Eating"))

    sound = analysis.sound
    if sound is None:
        sound_factor = Factor(id="sound", icon="sound", title="No sound analysis",
                              text="This result has no sound analysis.", ok=True)
    elif sound.mood.lower() in NEGATIVE_MOODS:
        sound_factor = Factor(id="sound", icon="sound", title="Distressed sounds heard",
                              text="A distressed vocal tone was picked up. A vet review is recommended.", ok=False)
    else:
        sound_factor = Factor(id="sound", icon="sound", title="No distress sounds heard",
                              text="No signs of vocal distress in this clip.", ok=True)

    factors = [
        Factor(id="rest", icon="sleep",
               title="Rested as much as usual" if rest_ok else "Rested differently than usual",
               text="Resting time is in line with the usual pattern." if rest_ok
               else "Resting time is noticeably different from this cat's usual pattern.",
               ok=rest_ok),
        Factor(id="eat", icon="food",
               title="Ate normally" if eat_ok else "Eating changed",
               text="Eating time is in line with the usual pattern." if eat_ok
               else "Eating time is noticeably different from this cat's usual pattern.",
               ok=eat_ok),
        sound_factor,
    ]

    done = db.scalar(select(func.count()).select_from(Analysis)
                     .where(Analysis.cat_id == cat.id, Analysis.status == "done")) or 0
    clips = min(done, BASELINE_TARGET)
    note = f"Baseline based on {clips} of {BASELINE_TARGET} videos"
    if clips < BASELINE_TARGET:
        note += " — less reliable"

    risk = analysis.risk
    return RiskReport(
        score=round(risk.score) if risk and risk.score is not None else 0,
        summary=SUMMARY.get(risk.level if risk else "Low", SUMMARY["Low"]).format(name=cat.name),
        factors=factors,
        baselineNote=note,
        baseline=[
            BaselineRow(id="rest", label="Resting", icon="sleep", delta=_delta(rest, metrics.get("Resting"))),
            BaselineRow(id="eat", label="Eating", icon="food", delta=_delta(eat, metrics.get("Eating"))),
            BaselineRow(id="move", label="Moving", icon="paw", delta=_delta(move, metrics.get("Moving"))),
        ],
    )