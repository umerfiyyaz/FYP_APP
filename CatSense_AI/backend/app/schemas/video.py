import uuid
from typing import Literal

from pydantic import BaseModel


class UploadOut(BaseModel):
    analysis_id: uuid.UUID
    status: str


class StatusOut(BaseModel):
    """What the Processing screen polls."""

    id: uuid.UUID
    status: Literal["queued", "processing", "done", "failed", "no_cat"]
    progress: int  # 0..100
    stage: str | None = None  # preparing | finding_cat | reading_behavior | listening_sound | health_report
    error: str | None = None