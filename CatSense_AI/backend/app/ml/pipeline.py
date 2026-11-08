"""Analysis pipeline.

!!! PLACEHOLDER !!!  The real models are not plugged in yet. This version does NOT look at the video.
It produces repeatable fake results (same file -> same result) so the whole flow
(upload -> progress -> history -> risk -> alert) can be built and tested.
Every result is tagged  model_versions = {"pipeline": "placeholder-v0"}  in the database.

When the real models are ready, replace the two marked blocks below (cat detection, behavior,
sound) and keep the PipelineResult shape. Nothing else in the backend or the app changes.
"""
import hashlib
import random
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Callable

VERSIONS = {"pipeline": "placeholder-v0", "placeholder": True}
MIN_REAL_VIDEO_BYTES = 50 * 1024  # placeholder rule: tiny files are treated as "no cat found"
CLIP_SECONDS = 60.0
BEHAVIORS = ["Eating", "Grooming", "Resting", "Moving", "Standing"]
MOODS = ["Happy", "Calm", "Calm", "Happy", "Hungry", "Curious", "Stressed"]


@dataclass
class Segment:
    start_s: float
    end_s: float
    behavior: str
    confidence: float  # 0..1


@dataclass
class PipelineResult:
    found_cat: bool
    duration_s: float = 0.0
    segments: list[Segment] = field(default_factory=list)
    sound_mood: str | None = None
    sound_confidence: float | None = None
    sound_breakdown: dict | None = None
    sound_waveform: list[int] | None = None
    model_versions: dict = field(default_factory=lambda: dict(VERSIONS))


Progress = Callable[[str, int], None]


def run(video_path: Path, progress: Progress) -> PipelineResult:
    progress("preparing", 10)
    time.sleep(0.8)

    # ---- BLOCK 1 (replace with the real cat detector) -------------------------------------------
    progress("finding_cat", 30)
    time.sleep(0.8)
    size = video_path.stat().st_size
    if size < MIN_REAL_VIDEO_BYTES:
        return PipelineResult(found_cat=False)
    with open(video_path, "rb") as f:
        rng = random.Random(int(hashlib.sha256(f.read(1024 * 1024)).hexdigest()[:8], 16))

    # ---- BLOCK 2 (replace with the real behavior model) -----------------------------------------
    progress("reading_behavior", 55)
    time.sleep(0.8)
    segments, t = [], 0.0
    while t < CLIP_SECONDS:
        length = min(rng.uniform(8, 20), CLIP_SECONDS - t)
        segments.append(Segment(round(t, 1), round(t + length, 1), rng.choice(BEHAVIORS), round(rng.uniform(0.6, 0.95), 2)))
        t += length

    # ---- BLOCK 3 (replace with the real sound model) --------------------------------------------
    progress("listening_sound", 80)
    time.sleep(0.8)
    mood = rng.choice(MOODS)
    confidence = round(rng.uniform(0.6, 0.9), 2)
    breakdown = {mood: confidence, "Calm": round(1 - confidence, 2)} if mood != "Calm" else {"Calm": confidence}

    waveform = [rng.randint(10, 72) for _ in range(20)]  # placeholder bars, not real audio

    progress("health_report", 95)
    time.sleep(0.5)
    return PipelineResult(
        found_cat=True,
        duration_s=CLIP_SECONDS,
        segments=segments,
        sound_mood=mood,
        sound_confidence=confidence,
        sound_breakdown=breakdown,
        sound_waveform=waveform,
    )