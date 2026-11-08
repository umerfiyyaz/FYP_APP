import uuid
from pathlib import Path

from fastapi import UploadFile

from app.config import settings
from app.core.exceptions import UnsupportedVideo, VideoTooLarge

ALLOWED_EXTENSIONS = {".mp4", ".mov", ".m4v", ".webm"}
CHUNK = 1024 * 1024  # 1 MB


def media_root() -> Path:
    return Path(settings.media_dir).resolve()


def absolute_path(relative: str) -> Path:
    return media_root() / relative


def save_video(file: UploadFile, cat_id: uuid.UUID) -> str:
    """Stream the upload to disk and return its path relative to the media folder.

    The stored name is random: the user's file name is never used as a path.
    """
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise UnsupportedVideo
    ctype = file.content_type or ""
    if ctype and not (ctype.startswith("video/") or ctype == "application/octet-stream"):
        raise UnsupportedVideo

    relative = Path("videos") / str(cat_id) / f"{uuid.uuid4().hex}{ext}"
    dest = media_root() / relative
    dest.parent.mkdir(parents=True, exist_ok=True)

    limit = settings.max_upload_mb * 1024 * 1024
    size = 0
    try:
        with open(dest, "wb") as out:
            while chunk := file.file.read(CHUNK):
                size += len(chunk)
                if size > limit:
                    raise VideoTooLarge
                out.write(chunk)
    except VideoTooLarge:
        dest.unlink(missing_ok=True)
        raise
    if size == 0:
        dest.unlink(missing_ok=True)
        raise UnsupportedVideo
    return relative.as_posix()


def delete_file(relative: str | None) -> None:
    if relative:
        absolute_path(relative).unlink(missing_ok=True)