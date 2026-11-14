from pydantic import BaseModel, field_validator

from app.schemas.user import _clean_email, check_password


def _code_ok(v: str) -> str:
    v = v.strip()
    if len(v) != 6 or not v.isdigit():
        raise ValueError("Enter the 6 digit code")
    return v


class CodeIn(BaseModel):
    code: str

    @field_validator("code")
    @classmethod
    def code_ok(cls, v: str) -> str:
        return _code_ok(v)


class ForgotIn(BaseModel):
    email: str

    @field_validator("email")
    @classmethod
    def email_ok(cls, v: str) -> str:
        return _clean_email(v)


class ResetIn(BaseModel):
    email: str
    code: str
    new_password: str

    @field_validator("email")
    @classmethod
    def email_ok(cls, v: str) -> str:
        return _clean_email(v)

    @field_validator("code")
    @classmethod
    def code_ok(cls, v: str) -> str:
        return _code_ok(v)

    @field_validator("new_password")
    @classmethod
    def password_ok(cls, v: str) -> str:
        return check_password(v)