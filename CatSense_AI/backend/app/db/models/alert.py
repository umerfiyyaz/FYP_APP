import uuid
from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Index, String, Text, func, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

ALERT_LEVELS = ("Low", "Medium", "High")
ALERT_STATUSES = ("new", "seen", "resolved")


class Alert(Base):
    __tablename__ = "alerts"
    __table_args__ = (
        CheckConstraint("level IN ('Low','Medium','High')", name="level"),
        CheckConstraint("status IN ('new','seen','resolved')", name="status"),
        Index("ix_alerts_cat_id_created_at", "cat_id", "created_at"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()")
    )
    cat_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("cats.id", ondelete="CASCADE"))
    analysis_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("analyses.id", ondelete="SET NULL"))
    level: Mapped[str] = mapped_column(String(6))
    title: Mapped[str] = mapped_column(String(160))
    message: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(10), default="new", server_default="new")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    cat: Mapped["Cat"] = relationship(back_populates="alerts")
    analysis: Mapped["Analysis | None"] = relationship(back_populates="alerts")