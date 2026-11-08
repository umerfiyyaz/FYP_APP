import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.models import User
from app.db.session import get_db
from app.schemas.alert import AlertOut, AlertStatusUpdate
from app.services import alert_service, cat_service

router = APIRouter(tags=["alerts"])


@router.get("/cats/{cat_id}/alerts", response_model=list[AlertOut])
def list_alerts(cat_id: uuid.UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if cat_service.get_cat(db, user, cat_id) is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Cat not found")
    return alert_service.list_alerts(db, cat_id)


@router.patch("/alerts/{alert_id}", response_model=AlertOut)
def update_alert(alert_id: uuid.UUID, data: AlertStatusUpdate, db: Session = Depends(get_db),
                 user: User = Depends(get_current_user)):
    alert = alert_service.get_alert(db, user, alert_id)
    if alert is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Alert not found")
    return alert_service.to_out(alert_service.set_status(db, alert, data.status))