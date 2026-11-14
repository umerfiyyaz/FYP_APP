from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password
from app.db.models import User
from app.schemas.user import LoginIn, SignUpIn


class EmailTaken(Exception):
    pass


def create_user(db: Session, data: SignUpIn) -> User:
    if db.scalar(select(User).where(User.email == data.email)):
        raise EmailTaken
    user = User(email=data.email, password_hash=hash_password(data.password), full_name=data.full_name)
    db.add(user)
    try:
        db.commit()
    except IntegrityError:  # two sign-ups with the same email at the same moment
        db.rollback()
        raise EmailTaken
    db.refresh(user)
    return user


def authenticate(db: Session, data: LoginIn) -> User | None:
    user = db.scalar(select(User).where(User.email == data.email))
    if user is None or not verify_password(data.password, user.password_hash):
        return None
    return user


def update_name(db: Session, user: User, full_name: str) -> User:
    user.full_name = full_name
    db.commit()
    db.refresh(user)
    return user


def email_taken(db: Session, email: str) -> bool:
    return db.scalar(select(User.id).where(func.lower(User.email) == email.strip().lower())) is not None


def find_by_email(db: Session, email: str) -> User | None:
    return db.scalar(select(User).where(func.lower(User.email) == email.strip().lower()))


def mark_verified(db: Session, user: User) -> User:
    user.email_verified = True
    db.commit()
    db.refresh(user)
    return user


def set_password(db: Session, user: User, new_password: str) -> User:
    user.password_hash = hash_password(new_password)
    user.email_verified = True  # the code from the email proves the address is theirs
    db.commit()
    db.refresh(user)
    return user