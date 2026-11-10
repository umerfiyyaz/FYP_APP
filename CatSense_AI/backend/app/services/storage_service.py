import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile, status

from app.config import settings
from app.core.exceptions import UnsupportedVideo, VideoTooLarge

ALLOWED_EXTENSIONS = {".mp4", ".mov", ".m4v", ".webm"}
CHUNK = 1024 * 1024  # 1 MB

PHOTO_TYPES = {".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp"}
MAX_PHOTO_BYTES = 5 * 1024 * 1024  # 5 MB


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


def _image_extension(head: bytes) -> str | None:
    """Look at the first bytes of the file, not at its name or the content type the client claims."""
    if head.startswith(b"\xff\xd8\xff"):
        return ".jpg"
    if head.startswith(b"\x89PNG\r\n\x1a\n"):
        return ".png"
    if head[:4] == b"RIFF" and head[8:12] == b"WEBP":
        return ".webp"
    return None


def save_cat_photo(file: UploadFile, cat_id: uuid.UUID) -> str:
    """Save a cat's profile photo (JPG, PNG or WEBP, up to 5 MB). Returns the relative path."""
    data = file.file.read(MAX_PHOTO_BYTES + 1)
    if len(data) > MAX_PHOTO_BYTES:
        raise HTTPException(status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, "The photo is too large (maximum 5 MB).")
    ext = _image_extension(data[:16])
    if ext is None:
        raise HTTPException(status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, "Please choose a JPG, PNG or WEBP photo.")

    relative = Path("photos") / str(cat_id) / f"{uuid.uuid4().hex}{ext}"
    dest = media_root() / relative
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(data)
    return relative.as_posix()


def delete_file(relative: str | None) -> None:
    if relative:
        absolute_path(relative).unlink(missing_ok=True)