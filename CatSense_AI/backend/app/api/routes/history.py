import uuid

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.models import User
from app.db.session import get_db
from app.schemas.analysis import HistoryOut
from app.services import cat_service, history_service

router = APIRouter(tags=["history"])


@router.get("/cats/{cat_id}/analyses", response_model=list[HistoryOut])
def list_history(cat_id: uuid.UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if cat_service.get_cat(db, user, cat_id) is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Cat not found")
    return history_service.list_history(db, cat_id)


@router.delete("/analyses/{analysis_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_analysis(analysis_id: uuid.UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    analysis = history_service.get_analysis(db, user, analysis_id)
    if analysis is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Result not found")
    history_service.delete_analysis(db, analysis)
    return Response(status_code=status.HTTP_204_NO_CONTENT)