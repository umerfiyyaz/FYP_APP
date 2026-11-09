class UnsupportedVideo(Exception):
    """The uploaded file is not an accepted video (wrong type or empty)."""


class VideoTooLarge(Exception):
    """The uploaded file is bigger than MAX_UPLOAD_MB."""

class InvalidTrim(Exception):
    def __init__(self, message: str):
        super().__init__(message)
        self.message = message


class FfmpegMissing(Exception):
    pass