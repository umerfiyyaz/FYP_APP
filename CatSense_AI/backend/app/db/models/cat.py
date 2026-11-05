import uuid
from datetime import date, datetime

from sqlalchemy import CheckConstraint, Date, DateTime, ForeignKey, Index, Numeric, String, func, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

ENVIRONMENTS = ("indoor", "outdoor", "both")


class Cat(Base):
    __tablename__ = "cats"
    __table_args__ = (
        CheckConstraint("environment IN ('indoor','outdoor','both')", name="environment"),
        Index("ix_cats_user_id", "user_id"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()")
    )
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    name: Mapped[str] = mapped_column(String(80))
    breed: Mapped[str | None] = mapped_column(String(80))
    birth_date: Mapped[date | None] = mapped_column(Date)
    sex: Mapped[str | None] = mapped_column(String(10))
    neutered: Mapped[bool | None]
    weight_kg: Mapped[float | None] = mapped_column(Numeric(4, 1))
    environment: Mapped[str] = mapped_column(String(10), default="indoor", server_default="indoor")
    photo_url: Mapped[str | None] = mapped_column(String(500))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user: Mapped["User"] = relationship(back_populates="cats")
    videos: Mapped[list["Video"]] = relationship(back_populates="cat", cascade="all, delete-orphan", passive_deletes=True)
    analyses: Mapped[list["Analysis"]] = relationship(back_populates="cat", cascade="all, delete-orphan", passive_deletes=True)
    alerts: Mapped[list["Alert"]] = relationship(back_populates="cat", cascade="all, delete-orphan", passive_deletes=True)
    baseline: Mapped["Baseline | None"] = relationship(back_populates="cat", cascade="all, delete-orphan", passive_deletes=True, uselist=False)
    water_logs: Mapped[list["WaterLog"]] = relationship(back_populates="cat", cascade="all, delete-orphan", passive_deletes=True)