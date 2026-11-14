import secrets
from datetime import datetime, timedelta, timezone

from sqlalchemy import select, update
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password
from app.db.models import EmailCode, User

CODE_MINUTES = 10     # how long a code works
MAX_ATTEMPTS = 5      # wrong tries before the code is dead
RESEND_SECONDS = 60   # the app may ask for a new code this often


class TooSoon(Exception):
    def __init__(self, seconds: int):
        self.seconds = seconds


def _now() -> datetime:
    return datetime.now(timezone.utc)


def issue_code(db: Session, user: User, purpose: str) -> str:
    """Make a new 6 digit code (older unused ones stop working) and return it so it can be emailed."""
    last = db.scalar(
        select(EmailCode)
        .where(EmailCode.user_id == user.id, EmailCode.purpose == purpose)
        .order_by(EmailCode.created_at.desc())
        .limit(1)
    )
    if last is not None:
        age = (_now() - last.created_at).total_seconds()
        if age < RESEND_SECONDS:
            raise TooSoon(int(RESEND_SECONDS - age) + 1)

    db.execute(
        update(EmailCode)
        .where(EmailCode.user_id == user.id, EmailCode.purpose == purpose, EmailCode.used_at.is_(None))
        .values(used_at=_now())
    )
    code = f"{secrets.randbelow(1_000_000):06d}"
    db.add(
        EmailCode(
            user_id=user.id,
            purpose=purpose,
            code_hash=hash_password(code),
            expires_at=_now() + timedelta(minutes=CODE_MINUTES),
        )
    )
    db.commit()
    return code


def check_code(db: Session, user: User, purpose: str, code: str) -> bool:
    """True (and the code is used up) when the code is right, not expired and not tried too often."""
    row = db.scalar(
        select(EmailCode)
        .where(EmailCode.user_id == user.id, EmailCode.purpose == purpose, EmailCode.used_at.is_(None))
        .order_by(EmailCode.created_at.desc())
        .limit(1)
    )
    if row is None or row.expires_at < _now() or row.attempts >= MAX_ATTEMPTS:
        return False
    if not verify_password(code.strip(), row.code_hash):
        row.attempts += 1
        db.commit()
        return False
    row.used_at = _now()
    db.commit()
    return True