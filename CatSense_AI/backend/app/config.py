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


settings = Settings()