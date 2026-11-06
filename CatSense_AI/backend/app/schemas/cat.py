import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, field_validator

Environment = Literal["Indoor", "Outdoor", "Both"]


def _required(v: str) -> str:
    v = v.strip()
    if not v:
        raise ValueError("This field is required")
    return v


class CatCreate(BaseModel):
    name: str = Field(max_length=80)
    breed: str = Field(default="Unknown", max_length=80)
    age_years: float = Field(ge=0, le=40)
    environment: Environment = "Indoor"

    @field_validator("name")
    @classmethod
    def name_ok(cls, v: str) -> str:
        return _required(v)

    @field_validator("breed")
    @classmethod
    def breed_ok(cls, v: str) -> str:
        return v.strip() or "Unknown"


class CatUpdate(BaseModel):
    """PATCH body: send only the fields that changed."""

    name: str | None = Field(default=None, max_length=80)
    breed: str | None = Field(default=None, max_length=80)
    age_years: float | None = Field(default=None, ge=0, le=40)
    environment: Environment | None = None

    @field_validator("name")
    @classmethod
    def name_ok(cls, v: str | None) -> str | None:
        return None if v is None else _required(v)

    @field_validator("breed")
    @classmethod
    def breed_ok(cls, v: str | None) -> str | None:
        return None if v is None else (v.strip() or "Unknown")


class CatOut(BaseModel):
    """Matches the frontend's CatDto (src/types/pets.ts)."""

    id: uuid.UUID
    name: str
    breed: str
    age_years: float
    environment: Environment
    photo_url: str | None = None
    created_at: datetime
    baseline_videos: int = 0
    last_analysis_at: datetime | None = None
    mood: str | None = None
    note: str | None = None
    attention: str | None = None