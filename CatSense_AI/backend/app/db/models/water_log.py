import uuid
from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Index, Integer, func, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class WaterLog(Base):
    """Optional water-intake feature. Drop this file + its route/service to remove it."""

    __tablename__ = "water_logs"
    __table_args__ = (
        CheckConstraint("amount_ml > 0", name="amount"),
        Index("ix_water_logs_cat_id_logged_at", "cat_id", "logged_at"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()")
    )
    cat_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("cats.id", ondelete="CASCADE"))
    amount_ml: Mapped[int] = mapped_column(Integer)
    logged_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    cat: Mapped["Cat"] = relationship(back_populates="water_logs")