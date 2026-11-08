from sqlalchemy.orm import Session

from app.db.models import Analysis, Cat, Video


def create_analysis(db: Session, cat: Cat, relative_path: str, source: str) -> Analysis:
    """Save the video row and a queued analysis for it."""
    video = Video(cat_id=cat.id, file_path=relative_path, source=source)
    analysis = Analysis(cat_id=cat.id, video=video, status="queued", progress=0, stage="preparing")
    db.add_all([video, analysis])
    db.commit()
    db.refresh(analysis)
    return analysis