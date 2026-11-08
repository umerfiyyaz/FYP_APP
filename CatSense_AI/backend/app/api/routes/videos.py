import uuid
from typing import Literal

from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.exceptions import UnsupportedVideo, VideoTooLarge
from app.config import settings
from app.db.models import User
from app.db.session import get_db
from app.schemas.video import UploadOut
from app.services import cat_service, storage_service, video_service
from app.worker import tasks

router = APIRouter(tags=["videos"])


@router.post("/cats/{cat_id}/videos", response_model=UploadOut, status_code=status.HTTP_202_ACCEPTED)
def upload_video(
    cat_id: uuid.UUID,
    background: BackgroundTasks,
    file: UploadFile = File(...),
    source: Literal["upload", "live"] = Form("upload"),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> UploadOut:
    cat = cat_service.get_cat(db, user, cat_id)
    if cat is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Cat not found")
    try:
        path = storage_service.save_video(file, cat.id)
    except UnsupportedVideo:
        raise HTTPException(status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, "Upload a video file (mp4, mov, m4v or webm)")
    except VideoTooLarge:
        raise HTTPException(status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, f"Video is larger than {settings.max_upload_mb} MB")

    analysis = video_service.create_analysis(db, cat, path, source)
    background.add_task(tasks.run_analysis, analysis.id)  # runs after this response is sent
    return UploadOut(analysis_id=analysis.id, status=analysis.status)