import uuid
from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Index, Integer, String, Text, func, text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

ANALYSIS_STATUSES = ("queued", "processing", "done", "failed", "no_cat")


class Analysis(Base):
    __tablename__ = "analyses"
    __table_args__ = (
        CheckConstraint("status IN ('queued','processing','done','failed','no_cat')", name="status"),
        CheckConstraint("progress BETWEEN 0 AND 100", name="progress"),
        Index("ix_analyses_cat_id_created_at", "cat_id", "created_at"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()")
    )
    cat_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("cats.id", ondelete="CASCADE"))
    video_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("videos.id", ondelete="SET NULL"))
    status: Mapped[str] = mapped_column(String(12), default="queued", server_default="queued")
    progress: Mapped[int] = mapped_column(Integer, default=0, server_default="0")
    stage: Mapped[str | None] = mapped_column(String(40))
    headline: Mapped[str | None] = mapped_column(String(80))  # short result text, e.g. "Calm & Content"
    model_versions: Mapped[dict | None] = mapped_column(JSONB)
    error: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    finished_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    cat: Mapped["Cat"] = relationship(back_populates="analyses")
    video: Mapped["Video | None"] = relationship(back_populates="analyses")
    segments: Mapped[list["BehaviorSegment"]] = relationship(
        back_populates="analysis", cascade="all, delete-orphan", passive_deletes=True, order_by="BehaviorSegment.start_s"
    )
    sound: Mapped["SoundResult | None"] = relationship(
        back_populates="analysis", cascade="all, delete-orphan", passive_deletes=True, uselist=False
    )
    risk: Mapped["RiskScore | None"] = relationship(
        back_populates="analysis", cascade="all, delete-orphan", passive_deletes=True, uselist=False
    )
    alerts: Mapped[list["Alert"]] = relationship(
        back_populates="analysis", cascade="all, delete-orphan", passive_deletes=True
    )