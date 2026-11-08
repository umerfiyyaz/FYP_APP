"""Builds the data for the Result, Timeline and Sound screens from what is stored. No colors or icons here:
those belong to the app's theme (src/services/analysis.ts adds them)."""
from app.db.models import Analysis, SoundResult
from app.db.models.behavior_segment import BEHAVIORS
from app.schemas.result import (
    BehaviorPercents, BreakdownOut, DominantMood, MoodShare, ResultOut, SoundOut, TimelineOut, TimelineSegmentOut,
)
from app.services.behavior_service import behavior_shares

UNCERTAIN_BELOW = 0.5  # segments with a lower confidence are shown as "Uncertain"
GAP = 0.05  # seconds

INTERPRETATION = {
    "Low": "Nothing unusual compared with the usual pattern. No action needed.",
    "Medium": "Some changes from the usual pattern. Keep an eye on {name} over the next days.",
    "High": "Clear changes from the usual pattern. Consider a vet check if it repeats.",
}

# (short description, explanation). Update when the final sound labels are decided.
MOOD_TEXT = {
    "happy": ("Content, relaxed vocal tone", "Vocal tone suggests comfort and contentment."),
    "calm": ("Soft, steady vocal tone", "Vocal tone is soft and steady. Nothing unusual."),
    "hungry": ("Demanding vocal tone", "Vocal tone suggests the cat may be asking for food or attention."),
    "curious": ("Questioning vocal tone", "Vocal tone is inquisitive. Nothing unusual."),
    "stressed": ("Distressed vocal tone", "Vocal tone suggests stress. If it repeats, consider a vet check."),
}
DEFAULT_MOOD_TEXT = ("Vocal tone picked up", "This is the most likely mood for the sound in this clip.")


def to_percentages(values: dict[str, float]) -> dict[str, int]:
    """Whole-number percentages that add up to exactly 100 (largest remainder method)."""
    total = sum(v for v in values.values() if v > 0)
    if total <= 0:
        return {k: 0 for k in values}
    raw = {k: max(v, 0) / total * 100 for k, v in values.items()}
    out = {k: int(v) for k, v in raw.items()}
    for k in sorted(raw, key=lambda k: raw[k] - out[k], reverse=True)[: 100 - sum(out.values())]:
        out[k] += 1
    return out


def clip_duration(a: Analysis) -> float:
    if a.video and a.video.duration_s:
        return a.video.duration_s
    return max((s.end_s for s in a.segments), default=0.0)


def _mood_percents(sound: SoundResult | None) -> list[tuple[str, int]]:
    if sound is None:
        return []
    raw = dict(sound.breakdown) if sound.breakdown else {}
    raw.setdefault(sound.mood, sound.confidence or 0.5)
    pct = to_percentages(raw)
    return sorted(pct.items(), key=lambda kv: kv[1], reverse=True)


def _dominant(sound: SoundResult | None) -> DominantMood | None:
    if sound is None:
        return None
    pct = dict(_mood_percents(sound))
    text = MOOD_TEXT.get(sound.mood.lower(), DEFAULT_MOOD_TEXT)[0]
    return DominantMood(name=sound.mood, percentage=pct.get(sound.mood, 0), description=text)


def build_result(a: Analysis) -> ResultOut:
    shares = behavior_shares(a)
    pct = to_percentages({b: shares.get(b, 0.0) for b in BEHAVIORS})
    dominant = _dominant(a.sound)
    level = a.risk.level if a.risk else "Low"
    return ResultOut(
        id=a.id,
        cat_id=a.cat_id,
        cat_name=a.cat.name,
        created_at=a.created_at,
        duration_sec=round(clip_duration(a)),
        risk_level=level,
        headline=a.headline or "Result",
        behaviors=BehaviorPercents(**{b.lower(): v for b, v in pct.items()}),
        dominant_mood=dominant,
        secondary_moods=[
            MoodShare(name=n, percentage=p) for n, p in _mood_percents(a.sound)
            if dominant and n != dominant.name and p > 0
        ],
        interpretation=INTERPRETATION[level].format(name=a.cat.name),
    )


def build_timeline(a: Analysis) -> TimelineOut:
    duration = clip_duration(a)
    segs, cursor = [], 0.0

    def gap(start: float, end: float) -> TimelineSegmentOut:
        return TimelineSegmentOut(start_s=round(start, 1), end_s=round(end, 1), behavior="No cat", confidence=0)

    for s in sorted(a.segments, key=lambda x: x.start_s):
        if s.start_s > cursor + GAP:
            segs.append(gap(cursor, s.start_s))
        conf = s.confidence if s.confidence is not None else 1.0
        label = "Uncertain" if conf < UNCERTAIN_BELOW else s.behavior
        segs.append(TimelineSegmentOut(start_s=s.start_s, end_s=s.end_s, behavior=label, confidence=round(conf * 100)))
        cursor = max(cursor, s.end_s)
    if duration > cursor + GAP:
        segs.append(gap(cursor, duration))

    seconds = {b: 0.0 for b in BEHAVIORS}
    for s in segs:
        if s.behavior in seconds:
            seconds[s.behavior] += s.end_s - s.start_s
    pct = to_percentages(seconds)
    breakdown = [
        BreakdownOut(name=b, seconds=round(seconds[b]), percentage=pct[b])
        for b in sorted(BEHAVIORS, key=lambda b: seconds[b], reverse=True)
    ]

    valid = [(i, s.end_s - s.start_s) for i, s in enumerate(segs) if s.behavior in seconds]
    focused = max(valid, key=lambda t: t[1])[0] if valid else 0
    return TimelineOut(
        session_id=a.id,
        cat_name=a.cat.name,
        created_at=a.created_at,
        clip_duration_sec=round(duration),
        segments=segs,
        focused_index=focused,
        time_breakdown=breakdown,
        total_valid_seconds=round(sum(seconds.values())),
    )


def build_sound(a: Analysis) -> SoundOut:
    sound = a.sound
    wave = sound.waveform if sound and sound.waveform else None
    peak = None
    if wave:
        peak = round((wave.index(max(wave)) + 0.5) / len(wave) * clip_duration(a), 1)
    explanation = MOOD_TEXT.get(sound.mood.lower(), DEFAULT_MOOD_TEXT)[1] if sound else "No sound analysis for this result."
    return SoundOut(
        clip_id=a.id,
        cat_name=a.cat.name,
        model_version=(a.model_versions or {}).get("pipeline"),
        match=_dominant(sound),
        moods=[MoodShare(name=n, percentage=p) for n, p in _mood_percents(sound)],
        waveform=wave,
        peak_time_sec=peak,
        explanation=explanation,
    )