import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel

from app.schemas.analysis import BehaviorLabel

RiskLevel = Literal["Low", "Medium", "High"]


class MoodShare(BaseModel):
    name: str
    percentage: int


class DominantMood(BaseModel):
    name: str
    percentage: int
    description: str


class BehaviorPercents(BaseModel):
    resting: int = 0
    grooming: int = 0
    moving: int = 0
    eating: int = 0
    standing: int = 0


class ResultOut(BaseModel):
    """Result screen. The app turns this into its AnalysisSummary (src/services/analysis.ts)."""

    id: uuid.UUID
    cat_id: uuid.UUID
    cat_name: str
    created_at: datetime
    duration_sec: int
    risk_level: RiskLevel
    headline: str
    behaviors: BehaviorPercents
    dominant_mood: DominantMood | None = None
    secondary_moods: list[MoodShare]
    interpretation: str


class TimelineSegmentOut(BaseModel):
    start_s: float
    end_s: float
    behavior: str  # one of the 5 behaviors, "Uncertain" (low confidence) or "No cat" (gap)
    confidence: int  # 0..100


class BreakdownOut(BaseModel):
    name: BehaviorLabel
    seconds: int
    percentage: int


class TimelineOut(BaseModel):
    session_id: uuid.UUID
    cat_name: str
    created_at: datetime
    clip_duration_sec: int
    segments: list[TimelineSegmentOut]
    focused_index: int  # the longest valid segment
    time_breakdown: list[BreakdownOut]
    total_valid_seconds: int


class SoundOut(BaseModel):
    clip_id: uuid.UUID
    cat_name: str
    model_version: str | None = None
    match: DominantMood | None = None
    moods: list[MoodShare]
    waveform: list[int] | None = None
    peak_time_sec: float | None = None
    explanation: str