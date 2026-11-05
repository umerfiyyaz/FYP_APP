"""Quick health check:  python -m scripts.check_db"""
from sqlalchemy import inspect, text

from app.db.session import engine


def main() -> None:
    with engine.connect() as conn:
        print("Connected to:", conn.execute(text("select current_database(), version()")).first())
    tables = sorted(inspect(engine).get_table_names())
    print(f"{len(tables)} tables:")
    for t in tables:
        print("  -", t)


if __name__ == "__main__":
    main()