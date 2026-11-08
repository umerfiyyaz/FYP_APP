from app.db.models import Analysis


def behavior_shares(analysis: Analysis) -> dict[str, float]:
    """Share of the clip (0..1) spent in each behavior, from the stored segments."""
    totals: dict[str, float] = {}
    for s in analysis.segments:
        totals[s.behavior] = totals.get(s.behavior, 0.0) + max(s.end_s - s.start_s, 0.0)
    whole = sum(totals.values())
    return {b: t / whole for b, t in totals.items()} if whole > 0 else {}


def dominant_behavior(analysis: Analysis) -> tuple[str, float | None]:
    """(behavior with the most time, its average confidence 0..1). Falls back to Resting if no segments."""
    shares = behavior_shares(analysis)
    if not shares:
        return "Resting", None
    top = max(shares, key=shares.get)
    confs = [s.confidence for s in analysis.segments if s.behavior == top and s.confidence is not None]
    return top, (sum(confs) / len(confs) if confs else None)