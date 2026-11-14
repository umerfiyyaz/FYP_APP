import re
import uuid

from pydantic import BaseModel, ConfigDict, Field, field_validator

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def _clean_email(value: str) -> str:
    value = value.strip().lower()
    if len(value) > 255 or not EMAIL_RE.match(value):
        raise ValueError("Enter a valid email address")
    return value


def check_password(v: str) -> str:
    """The password rules, shared by sign up and password reset."""
    if len(v) < 8:
        raise ValueError("Password must contain at least 8 characters")
    if len(v.encode("utf-8")) > 72:
        raise ValueError("Password is too long (max 72 characters)")
    if not any(c.isalpha() for c in v) or not any(c.isdigit() for c in v):
        raise ValueError("Password must contain at least one letter and one number")
    return v


class SignUpIn(BaseModel):
    email: str
    password: str = Field(min_length=8)
    full_name: str | None = Field(default=None, max_length=120)

    @field_validator("email")
    @classmethod
    def email_ok(cls, v: str) -> str:
        return _clean_email(v)

    @field_validator("password")
    @classmethod
    def password_ok(cls, v: str) -> str:
        return check_password(v)

    @field_validator("full_name")
    @classmethod
    def name_ok(cls, v: str | None) -> str | None:
        v = v.strip() if v else None
        return v or None


class LoginIn(BaseModel):
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def email_ok(cls, v: str) -> str:
        return _clean_email(v)


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: str
    full_name: str | None = None
    email_verified: bool = False


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut