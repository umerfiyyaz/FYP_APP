import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.models import User
from app.db.session import get_db
from app.schemas.analysis import RiskReport
from app.schemas.video import StatusOut
from app.services import history_service, risk_service

router = APIRouter(prefix="/analyses", tags=["analyses"])


def _own(db: Session, user: User, analysis_id: uuid.UUID):
    analysis = history_service.get_analysis(db, user, analysis_id)
    if analysis is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Result not found")
    return analysis


@router.get("/{analysis_id}/status", response_model=StatusOut)
def get_status(analysis_id: uuid.UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    a = _own(db, user, analysis_id)
    return StatusOut(id=a.id, status=a.status, progress=a.progress, stage=a.stage, error=a.error)


@router.get("/{analysis_id}/risk", response_model=RiskReport)
def get_risk_report(analysis_id: uuid.UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    analysis = _own(db, user, analysis_id)
    if analysis.status != "done":
        raise HTTPException(status.HTTP_409_CONFLICT, "Result is not ready yet")
    return risk_service.build_risk_report(db, analysis, analysis.cat)