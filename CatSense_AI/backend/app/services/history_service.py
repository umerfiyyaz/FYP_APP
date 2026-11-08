import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload
from app.services import storage_service

from app.db.models import Analysis, Cat, User
from app.schemas.analysis import HistoryOut
from app.services.behavior_service import dominant_behavior


def load_options():
    return (
        selectinload(Analysis.segments),
        selectinload(Analysis.sound),
        selectinload(Analysis.risk),
        selectinload(Analysis.alerts),
        selectinload(Analysis.video),
    )


def to_history_item(a: Analysis) -> HistoryOut:
    behavior, behavior_conf = dominant_behavior(a)
    sound = a.sound
    alert = max(a.alerts, key=lambda x: x.created_at) if a.alerts else None

    if alert:
        kind = "alert"
    elif not a.segments and sound:
        kind = "sound"
    else:
        kind = "behavior"

    if behavior_conf is not None:
        confidence = behavior_conf
    elif sound and sound.confidence is not None:
        confidence = sound.confidence
    else:
        confidence = 0.0

    mood = sound.mood if sound else "Unknown"
    if alert:
        title, subtitle = alert.title, (alert.emphasis or alert.source)
    else:
        title = a.headline or f"{behavior} session"
        subtitle = f"Mostly {behavior.lower()} • {mood} mood"

    if a.video and a.video.duration_s:
        duration = a.video.duration_s
    else:
        duration = max((s.end_s for s in a.segments), default=0.0)

    return HistoryOut(
        id=a.id,
        cat_id=a.cat_id,
        created_at=a.created_at,
        duration_sec=round(duration),
        kind=kind,
        behavior=behavior,
        confidence=round(confidence * 100),
        mood=mood,
        title=title,
        subtitle=subtitle,
        risk=round(a.risk.score) if a.risk and a.risk.score is not None else 0,
        thumb_url=None,  # video thumbnails come with the upload step
    )


def list_history(db: Session, cat_id: uuid.UUID) -> list[HistoryOut]:
    rows = db.scalars(
        select(Analysis)
        .where(Analysis.cat_id == cat_id, Analysis.status == "done")
        .options(*load_options())
        .order_by(Analysis.created_at.desc())
    ).all()
    return [to_history_item(a) for a in rows]


def get_analysis(db: Session, user: User, analysis_id: uuid.UUID) -> Analysis | None:
    """Only returns the analysis if its cat belongs to this user."""
    return db.scalar(
        select(Analysis)
        .join(Cat, Cat.id == Analysis.cat_id)
        .where(Analysis.id == analysis_id, Cat.user_id == user.id)
        .options(*load_options())
    )

def delete_analysis(db: Session, analysis: Analysis) -> None:
    video = analysis.video
    file_path = video.file_path if video else None
    db.delete(analysis)  # segments, sound, risk and alerts go with it (database cascade)
    if video is not None:
        db.delete(video)
    db.commit()
    storage_service.delete_file(file_path)  # the file goes only after the database delete worked