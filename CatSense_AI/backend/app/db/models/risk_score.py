import uuid

from sqlalchemy import CheckConstraint, Float, ForeignKey, String, text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

RISK_LEVELS = ("Low", "Medium", "High")


class RiskScore(Base):
    __tablename__ = "risk_scores"
    __table_args__ = (CheckConstraint("level IN ('Low','Medium','High')", name="level"),)

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()")
    )
    analysis_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("analyses.id", ondelete="CASCADE"), unique=True)
    level: Mapped[str] = mapped_column(String(6))
    score: Mapped[float | None] = mapped_column(Float)  # 0-100
    reasons: Mapped[dict | None] = mapped_column(JSONB)  # explanation / contributing factors

    analysis: Mapped["Analysis"] = relationship(back_populates="risk")