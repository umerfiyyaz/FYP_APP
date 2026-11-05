import uuid

from sqlalchemy import CheckConstraint, Float, ForeignKey, Index, String, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

# Only these five labels are ever stored.
BEHAVIORS = ("Eating", "Grooming", "Resting", "Moving", "Standing")


class BehaviorSegment(Base):
    __tablename__ = "behavior_segments"
    __table_args__ = (
        CheckConstraint("behavior IN ('Eating','Grooming','Resting','Moving','Standing')", name="behavior"),
        CheckConstraint("end_s >= start_s", name="range"),
        Index("ix_behavior_segments_analysis_id", "analysis_id"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()")
    )
    analysis_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("analyses.id", ondelete="CASCADE"))
    start_s: Mapped[float] = mapped_column(Float)
    end_s: Mapped[float] = mapped_column(Float)
    behavior: Mapped[str] = mapped_column(String(10))
    confidence: Mapped[float | None] = mapped_column(Float)

    analysis: Mapped["Analysis"] = relationship(back_populates="segments")