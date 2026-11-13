from pydantic import BaseModel, Field, field_validator


class UserUpdate(BaseModel):
    """PATCH /auth/me body: the user's display name."""

    full_name: str = Field(max_length=80)

    @field_validator("full_name")
    @classmethod
    def name_ok(cls, v: str) -> str:
        v = " ".join(v.split())  # trims and collapses repeated spaces
        if not v:
            raise ValueError("Name cannot be empty")
        return v