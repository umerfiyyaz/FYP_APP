"""Cut a video to the part the user chose (start/end in seconds) using ffmpeg."""
import json
import math
import shutil
import subprocess
from pathlib import Path
from typing import Optional

from app.config import settings
from app.core.exceptions import FfmpegMissing, InvalidTrim, UnsupportedVideo
from app.services import storage_service

MIN_CLIP_SECONDS = 1.0


def _tool(name: str) -> str:
    found = shutil.which(name)
    if found is None:
        raise FfmpegMissing(name)
    return found


def probe_duration(path: Path) -> float:
    """Length of the video in seconds. Raises UnsupportedVideo if it cannot be read."""
    cmd = [_tool("ffprobe"), "-v", "error", "-show_entries", "format=duration", "-of", "json", str(path)]
    try:
        out = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        duration = float(json.loads(out.stdout)["format"]["duration"])
    except (subprocess.TimeoutExpired, ValueError, KeyError, json.JSONDecodeError):
        raise UnsupportedVideo()
    if out.returncode != 0 or not math.isfinite(duration) or duration <= 0:
        raise UnsupportedVideo()
    return duration


def resolve_range(start: Optional[float], end: Optional[float], duration: float) -> tuple[float, float]:
    """Check the user's start/end against the real video length and return a safe range."""
    s = 0.0 if start is None else float(start)
    e = duration if end is None else float(end)
    if not (math.isfinite(s) and math.isfinite(e)):
        raise InvalidTrim("Start and end must be numbers")
    if s < 0:
        raise InvalidTrim("Start cannot be negative")
    if e <= s:
        raise InvalidTrim("End must be after start")
    if s >= duration:
        raise InvalidTrim("Start is beyond the end of the video")
    e = min(e, duration)
    length = e - s
    if length < MIN_CLIP_SECONDS:
        raise InvalidTrim(f"Choose at least {MIN_CLIP_SECONDS:g} second")
    if length > settings.max_clip_seconds:
        raise InvalidTrim(f"Choose at most {settings.max_clip_seconds} seconds")
    return round(s, 2), round(e, 2)


def discard(rel_path: str) -> None:
    """Remove a saved upload (used when trimming is refused)."""
    storage_service.absolute_path(rel_path).unlink(missing_ok=True)


def trim_video(rel_path: str, start: Optional[float], end: Optional[float]) -> str:
    """Cut the saved video, delete the original and return the new relative path (always .mp4)."""
    ffmpeg = _tool("ffmpeg")
    src = storage_service.absolute_path(rel_path)
    duration = probe_duration(src)
    s, e = resolve_range(start, end, duration)

    dst = src.with_name(src.stem + "_trim.mp4")
    cmd = [
        ffmpeg, "-y", "-v", "error",
        "-ss", str(s), "-i", str(src), "-t", str(round(e - s, 2)),
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "23",
        "-c:a", "aac", "-movflags", "+faststart", str(dst),
    ]
    try:
        done = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
    except subprocess.TimeoutExpired:
        dst.unlink(missing_ok=True)
        raise UnsupportedVideo()
    if done.returncode != 0 or not dst.exists() or dst.stat().st_size == 0:
        dst.unlink(missing_ok=True)
        raise UnsupportedVideo()

    src.unlink(missing_ok=True)
    return str(Path(rel_path).with_name(dst.name)).replace("\\", "/")