# Importing every model here registers it on Base.metadata (Alembic needs this).
from app.db.models.user import User
from app.db.models.email_code import EmailCode
from app.db.models.cat import Cat
from app.db.models.video import Video
from app.db.models.analysis import Analysis
from app.db.models.behavior_segment import BehaviorSegment
from app.db.models.sound_result import SoundResult
from app.db.models.risk_score import RiskScore
from app.db.models.alert import Alert
from app.db.models.baseline import Baseline
from app.db.models.water_log import WaterLog

__all__ = [
    "User", "EmailCode", "Cat", "Video", "Analysis", "BehaviorSegment",
    "SoundResult", "RiskScore", "Alert", "Baseline", "WaterLog",
]