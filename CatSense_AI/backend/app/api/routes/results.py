import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.models import Analysis, User
from app.db.session import get_db
from app.schemas.result import ResultOut, SoundOut, TimelineOut
from app.services import history_service, result_service

router = APIRouter(prefix="/analyses", tags=["results"])


def _ready(db: Session, user: User, analysis_id: uuid.UUID) -> Analysis:
    analysis = history_service.get_analysis(db, user, analysis_id)
    if analysis is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Result not found")
    if analysis.status != "done":
        raise HTTPException(status.HTTP_409_CONFLICT, "Result is not ready yet")
    return analysis


@router.get("/{analysis_id}/result", response_model=ResultOut)
def get_result(analysis_id: uuid.UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return result_service.build_result(_ready(db, user, analysis_id))


@router.get("/{analysis_id}/timeline", response_model=TimelineOut)
def get_timeline(analysis_id: uuid.UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return result_service.build_timeline(_ready(db, user, analysis_id))


@router.get("/{analysis_id}/sound", response_model=SoundOut)
def get_sound(analysis_id: uuid.UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return result_service.build_sound(_ready(db, user, analysis_id))