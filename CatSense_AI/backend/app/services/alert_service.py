import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import Alert, Cat, User
from app.schemas.alert import AlertOut


def to_out(a: Alert) -> AlertOut:
    return AlertOut(
        id=a.id, cat_id=a.cat_id, item_id=a.analysis_id, level=a.level, title=a.title, detail=a.detail,
        emphasis=a.emphasis, source=a.source, created_at=a.created_at, confidence=a.confidence,
        duration_sec=a.duration_sec, status=a.status,
    )


def list_alerts(db: Session, cat_id: uuid.UUID) -> list[AlertOut]:
    rows = db.scalars(select(Alert).where(Alert.cat_id == cat_id).order_by(Alert.created_at.desc())).all()
    return [to_out(a) for a in rows]


def get_alert(db: Session, user: User, alert_id: uuid.UUID) -> Alert | None:
    """Only returns the alert if its cat belongs to this user."""
    return db.scalar(
        select(Alert).join(Cat, Cat.id == Alert.cat_id).where(Alert.id == alert_id, Cat.user_id == user.id)
    )


def set_status(db: Session, alert: Alert, status: str) -> Alert:
    alert.status = status
    db.commit()
    db.refresh(alert)
    return alert