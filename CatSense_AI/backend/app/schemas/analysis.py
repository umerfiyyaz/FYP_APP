import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel

BehaviorLabel = Literal["Eating", "Grooming", "Resting", "Moving", "Standing"]
ItemKind = Literal["behavior", "sound", "alert"]


class HistoryOut(BaseModel):
    """Matches the frontend's HistoryDto (src/services/historyApi.ts)."""

    id: uuid.UUID
    cat_id: uuid.UUID
    created_at: datetime
    duration_sec: int
    kind: ItemKind
    behavior: BehaviorLabel
    confidence: int  # 0..100
    mood: str
    title: str
    subtitle: str
    risk: int  # 0..100
    thumb_url: str | None = None


class Factor(BaseModel):
    id: str
    icon: Literal["sleep", "food", "sound"]
    title: str
    text: str
    ok: bool


class BaselineRow(BaseModel):
    id: str
    label: str
    icon: Literal["sleep", "food", "paw"]
    delta: int | None = None  # % change vs the cat's own baseline, None = plain "Normal"


class RiskReport(BaseModel):
    """Matches the frontend's RiskReport (src/services/riskReport.ts). Note: baselineNote is camelCase."""

    score: int
    summary: str
    factors: list[Factor]
    baselineNote: str
    baseline: list[BaselineRow]