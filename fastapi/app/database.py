from pathlib import Path
from sqlalchemy import create_engine
from .settings import settings


def build_db_url() -> str:
    """Build database URL from settings."""
    driver = settings.DB_CONNECTION
    if driver == "sqlite":
        db_path = Path(__file__).resolve().parents[2] / settings.DB_DATABASE
        return f"sqlite:///{db_path}"
    return f"{driver}+pymysql://{settings.DB_USERNAME}:{settings.DB_PASSWORD}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_DATABASE}"


engine = create_engine(build_db_url(), pool_pre_ping=True)
