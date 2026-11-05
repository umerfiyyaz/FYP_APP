"""Demo data for development.  python -m scripts.seed_demo   (add --reset to wipe the demo user first)

Login: demo@catsense.ai / demo1234
Remove later with:  python -m scripts.seed_demo --remove
"""
import sys
from datetime import date, datetime, timedelta, timezone

from sqlalchemy import select

from app.core.security import hash_password
from app.db.models import (
    Alert, Analysis, BehaviorSegment, Baseline, Cat, RiskScore, SoundResult, User, WaterLog,
)
from app.db.session import SessionLocal

EMAIL = "demo@catsense.ai"
NOW = datetime.now(timezone.utc)


def remove(db) -> None:
    user = db.scalar(select(User).where(User.email == EMAIL))
    if user:
        db.delete(user)  # cascades to cats, analyses, alerts, ...
        db.commit()


def add_analysis(db, cat, days_ago, level, mood, segs):
    created = NOW - timedelta(days=days_ago)
    a = Analysis(cat=cat, status="done", progress=100, stage="done", created_at=created, finished_at=created)
    for start, end, behavior, conf in segs:
        a.segments.append(BehaviorSegment(start_s=start, end_s=end, behavior=behavior, confidence=conf))
    a.sound = SoundResult(mood=mood, confidence=0.8, breakdown={mood: 0.8, "Calm": 0.12})
    a.risk = RiskScore(level=level, score={"Low": 12, "Medium": 48, "High": 81}[level], reasons={"note": "demo data"})
    db.add(a)
    return a


def main() -> None:
    with SessionLocal() as db:
        if "--remove" in sys.argv:
            remove(db)
            print("Demo user removed.")
            return
        if "--reset" in sys.argv:
            remove(db)
        if db.scalar(select(User).where(User.email == EMAIL)):
            print("Demo user already exists (use --reset to recreate).")
            return

        user = User(email=EMAIL, password_hash=hash_password("demo1234"), full_name="Demo User")
        milo = Cat(user=user, name="Milo", breed="Domestic Shorthair", birth_date=date(2022, 3, 1), environment="indoor")
        luna = Cat(user=user, name="Luna", breed="Persian", birth_date=date(2021, 7, 15), environment="indoor")
        oliver = Cat(user=user, name="Oliver", breed="Maine Coon", birth_date=date(2020, 1, 20), environment="both")
        db.add_all([user, milo, luna, oliver])

        calm = [(0, 30, "Resting", 0.9), (30, 45, "Grooming", 0.8), (45, 60, "Moving", 0.7)]
        busy = [(0, 20, "Moving", 0.8), (20, 40, "Eating", 0.85), (40, 60, "Standing", 0.7)]
        add_analysis(db, milo, 0, "Low", "Happy", calm)
        add_analysis(db, milo, 1, "Low", "Calm", calm)
        add_analysis(db, milo, 3, "Medium", "Hungry", busy)
        add_analysis(db, luna, 2, "Low", "Calm", calm)
        warn = add_analysis(db, oliver, 1, "High", "Stressed", busy)
        db.flush()

        db.add(Alert(cat=oliver, analysis=warn, level="High", title="Unusual activity pattern",
                     message="Demo alert generated from seed data.", status="new"))
        for cat in (milo, luna, oliver):
            db.add(Baseline(cat=cat, clips_count=3, metrics={"Resting": 0.6, "Grooming": 0.15, "Moving": 0.15, "Eating": 0.05, "Standing": 0.05}))
        db.add(WaterLog(cat=milo, amount_ml=120))
        db.commit()
        print("Seeded. Login: demo@catsense.ai / demo1234")


if __name__ == "__main__":
    main()