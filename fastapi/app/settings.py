from pathlib import Path
from pydantic_settings import BaseSettings  # type: ignore


class Settings(BaseSettings):  # type: ignore
    FASTAPI_HOST: str = "0.0.0.0"
    FASTAPI_PORT: int = 8001

    DB_CONNECTION: str = "sqlite"
    DB_HOST: str = "127.0.0.1"
    DB_PORT: int = 3306
    DB_DATABASE: str = "database/database.sqlite"
    DB_USERNAME: str = "root"
    DB_PASSWORD: str = ""

    model_config = {
        "env_file": str(Path(__file__).resolve().parents[2] / ".env"),
        "extra": "allow",
    }


# instantiate settings for import
settings = Settings()
