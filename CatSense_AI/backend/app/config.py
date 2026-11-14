from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+psycopg://catsense:catsense@localhost:5432/catsense"
    jwt_secret: str = "change-me"
    jwt_expire_minutes: int = 60 * 24 * 7

    # Uploaded videos are stored under this folder (relative to the backend folder).
    media_dir: str = "storage"
    max_upload_mb: int = 200
    max_clip_seconds: int = 60   # longest clip the user may keep after trimming

    # Email (verification and password-reset codes). Leave smtp_host empty in development:
    # the code is then printed in the backend terminal instead of being emailed.
    # Gmail: smtp_host=smtp.gmail.com, smtp_port=587, smtp_user=<your gmail>, smtp_password=<16 character app password>
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    mail_from: str = ""   # for example: CatSense AI <yourgmail@gmail.com>


settings = Settings()