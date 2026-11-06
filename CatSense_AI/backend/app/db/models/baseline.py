import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, func, text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Baseline(Base):
    """One row per cat: what 'normal' looks like, built from the first clips."""

    __tablename__ = "baselines"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()")
    )
    cat_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("cats.id", ondelete="CASCADE"), unique=True)
    metrics: Mapped[dict | None] = mapped_column(JSONB)  # e.g. {"Resting": 0.62, "Moving": 0.10, ...}
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    cat: Mapped["Cat"] = relationship(back_populates="baseline")