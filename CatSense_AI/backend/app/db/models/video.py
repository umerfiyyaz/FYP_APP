import uuid
from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, Float, ForeignKey, Index, String, func, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

VIDEO_SOURCES = ("upload", "live")


class Video(Base):
    __tablename__ = "videos"
    __table_args__ = (
        CheckConstraint("source IN ('upload','live')", name="source"),
        Index("ix_videos_cat_id", "cat_id"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()")
    )
    cat_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("cats.id", ondelete="CASCADE"))
    file_path: Mapped[str] = mapped_column(String(500))
    source: Mapped[str] = mapped_column(String(10), default="upload", server_default="upload")
    duration_s: Mapped[float | None] = mapped_column(Float)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    cat: Mapped["Cat"] = relationship(back_populates="videos")
    analyses: Mapped[list["Analysis"]] = relationship(back_populates="video", passive_deletes=True)