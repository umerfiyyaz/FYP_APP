import logging

from app.db.models import Analysis
from app.db.session import SessionLocal
from app.ml import pipeline
from app.services import analysis_service, storage_service

log = logging.getLogger("catsense.worker")


def run_analysis(analysis_id) -> None:
    """Runs in the background after the upload response has been sent."""
    db = SessionLocal()
    try:
        analysis = db.get(Analysis, analysis_id)
        if analysis is None or analysis.video is None:
            return

        def progress(stage: str, percent: int) -> None:
            analysis.status, analysis.stage, analysis.progress = "processing", stage, percent
            db.commit()

        path = storage_service.absolute_path(analysis.video.file_path)
        result = pipeline.run(path, progress)
        analysis_service.save_result(db, analysis, result)
    except Exception:
        log.exception("analysis %s failed", analysis_id)
        db.rollback()
        failed = db.get(Analysis, analysis_id)
        if failed is not None:
            failed.status, failed.error = "failed", "Processing failed"
            db.commit()
    finally:
        db.close()