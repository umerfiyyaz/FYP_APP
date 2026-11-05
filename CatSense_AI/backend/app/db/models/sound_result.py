import uuid

from sqlalchemy import Float, ForeignKey, String, text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class SoundResult(Base):
    __tablename__ = "sound_results"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()")
    )
    analysis_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("analyses.id", ondelete="CASCADE"), unique=True)
    mood: Mapped[str] = mapped_column(String(30))  # label comes from the sound model, kept free-text on purpose
    confidence: Mapped[float | None] = mapped_column(Float)
    breakdown: Mapped[dict | None] = mapped_column(JSONB)  # e.g. {"Happy": 0.82, "Calm": 0.10}

    analysis: Mapped["Analysis"] = relationship(back_populates="sound")