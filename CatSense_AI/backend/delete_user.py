"""Delete one account (and its cats, analyses and codes) so the email can be used again.

Run from the backend folder:   python delete_user.py someone@gmail.com
"""
import sys

from sqlalchemy import create_engine, text

from app.config import settings


def main() -> None:
    if len(sys.argv) != 2:
        print("Usage: python delete_user.py email@example.com")
        return
    email = sys.argv[1].strip().lower()
    engine = create_engine(settings.database_url)
    with engine.begin() as conn:
        n = conn.execute(text("delete from users where lower(email) = :e"), {"e": email}).rowcount
    print(f"Deleted {n} account(s) for {email}")


if __name__ == "__main__":
    main()