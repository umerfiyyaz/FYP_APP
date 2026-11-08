import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel

AlertLevel = Literal["high", "medium", "advisory"]
AlertStatus = Literal["open", "resolved", "dismissed", "acknowledged"]


class AlertOut(BaseModel):
    """Matches the frontend's AlertDto (src/types/pets.ts)."""

    id: uuid.UUID
    cat_id: uuid.UUID
    item_id: uuid.UUID  # the analysis (history item) that caused the alert
    level: AlertLevel
    title: str
    detail: str
    emphasis: str | None = None
    source: str
    created_at: datetime
    confidence: float | None = None
    duration_sec: float | None = None
    status: AlertStatus


class AlertStatusUpdate(BaseModel):
    status: AlertStatus