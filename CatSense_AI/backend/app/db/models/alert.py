import uuid
from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, Float, ForeignKey, Index, String, Text, func, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

ALERT_LEVELS = ("high", "medium", "advisory")
ALERT_STATUSES = ("open", "resolved", "dismissed", "acknowledged")


class Alert(Base):
    """An alert always comes from one analysis (the frontend's `item_id`)."""

    __tablename__ = "alerts"
    __table_args__ = (
        CheckConstraint("level IN ('high','medium','advisory')", name="level"),
        CheckConstraint("status IN ('open','resolved','dismissed','acknowledged')", name="status"),
        Index("ix_alerts_cat_id_created_at", "cat_id", "created_at"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()")
    )
    cat_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("cats.id", ondelete="CASCADE"))
    analysis_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("analyses.id", ondelete="CASCADE"))
    level: Mapped[str] = mapped_column(String(8))
    title: Mapped[str] = mapped_column(String(160))
    detail: Mapped[str] = mapped_column(Text)
    emphasis: Mapped[str | None] = mapped_column(String(160))  # part of `detail` shown bold
    source: Mapped[str] = mapped_column(String(40))  # "Video analysis", "Sound analysis"
    confidence: Mapped[float | None] = mapped_column(Float)  # 0..100
    duration_sec: Mapped[float | None] = mapped_column(Float)
    status: Mapped[str] = mapped_column(String(12), default="open", server_default="open")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    cat: Mapped["Cat"] = relationship(back_populates="alerts")
    analysis: Mapped["Analysis"] = relationship(back_populates="alerts")