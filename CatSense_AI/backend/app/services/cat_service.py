import shutil
import uuid
from pathlib import Path

from fastapi import UploadFile
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db.models import Alert, Analysis, Cat, User
from app.schemas.cat import CatCreate, CatOut, CatUpdate
from app.services import storage_service

BASELINE_TARGET = 3  # frontend: "3 = baseline complete"


def _summaries(db: Session, cat_ids: list[uuid.UUID]) -> dict[uuid.UUID, dict]:
    """Derived fields the app shows on each cat card (nothing here is stored on the cat)."""
    out = {
        cid: {"baseline_videos": 0, "last_analysis_at": None, "mood": None, "attention": None}
        for cid in cat_ids
    }
    if not cat_ids:
        return out

    done = Analysis.status == "done"
    when = func.coalesce(Analysis.finished_at, Analysis.created_at)

    counts = db.execute(
        select(Analysis.cat_id, func.count(), func.max(when))
        .where(Analysis.cat_id.in_(cat_ids), done)
        .group_by(Analysis.cat_id)
    ).all()
    for cat_id, n, last in counts:
        out[cat_id]["baseline_videos"] = min(n, BASELINE_TARGET)
        out[cat_id]["last_analysis_at"] = last

    latest = db.execute(
        select(Analysis.cat_id, Analysis.headline)
        .where(Analysis.cat_id.in_(cat_ids), done)
        .distinct(Analysis.cat_id)
        .order_by(Analysis.cat_id, Analysis.created_at.desc())
    ).all()
    for cat_id, headline in latest:
        out[cat_id]["mood"] = headline

    attention = db.execute(
        select(Alert.cat_id, Alert.title)
        .where(Alert.cat_id.in_(cat_ids), Alert.status == "open", Alert.level.in_(("high", "medium")))
        .distinct(Alert.cat_id)
        .order_by(Alert.cat_id, Alert.created_at.desc())
    ).all()
    for cat_id, title in attention:
        out[cat_id]["attention"] = title
    return out


def _photo_link(cat: Cat) -> str | None:
    """The column keeps the file's path; the app gets a link to the (login-protected) photo endpoint.

    The ?v= part changes with every new photo, so the phone never shows an old cached picture.
    """
    if not cat.photo_url:
        return None
    return f"/cats/{cat.id}/photo?v={Path(cat.photo_url).stem}"


def to_out(cat: Cat, summary: dict) -> CatOut:
    return CatOut(
        id=cat.id, name=cat.name, breed=cat.breed, age_years=cat.age_years,
        environment=cat.environment, photo_url=_photo_link(cat), created_at=cat.created_at, **summary,
    )


def list_cats(db: Session, user: User) -> list[CatOut]:
    cats = list(db.scalars(select(Cat).where(Cat.user_id == user.id).order_by(Cat.created_at)))
    summaries = _summaries(db, [c.id for c in cats])
    return [to_out(c, summaries[c.id]) for c in cats]


def get_cat(db: Session, user: User, cat_id: uuid.UUID) -> Cat | None:
    """Only returns the cat if it belongs to this user."""
    return db.scalar(select(Cat).where(Cat.id == cat_id, Cat.user_id == user.id))


def present(db: Session, cat: Cat) -> CatOut:
    return to_out(cat, _summaries(db, [cat.id])[cat.id])


def create_cat(db: Session, user: User, data: CatCreate) -> Cat:
    cat = Cat(user_id=user.id, **data.model_dump())
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


def update_cat(db: Session, cat: Cat, data: CatUpdate) -> Cat:
    for field, value in data.model_dump(exclude_unset=True, exclude_none=True).items():
        setattr(cat, field, value)
    db.commit()
    db.refresh(cat)
    return cat


def set_photo(db: Session, cat: Cat, file: UploadFile) -> Cat:
    new_path = storage_service.save_cat_photo(file, cat.id)
    old_path = cat.photo_url
    cat.photo_url = new_path
    db.commit()
    db.refresh(cat)
    storage_service.delete_file(old_path)  # only after the new one is saved
    return cat


def clear_photo(db: Session, cat: Cat) -> Cat:
    old_path = cat.photo_url
    cat.photo_url = None
    db.commit()
    db.refresh(cat)
    storage_service.delete_file(old_path)
    return cat


def delete_cat(db: Session, cat: Cat) -> None:
    cat_id = cat.id
    db.delete(cat)  # the database cascades to videos, analyses, alerts, ...
    db.commit()
    root = storage_service.media_root()
    shutil.rmtree(root / "videos" / str(cat_id), ignore_errors=True)
    shutil.rmtree(root / "photos" / str(cat_id), ignore_errors=True)