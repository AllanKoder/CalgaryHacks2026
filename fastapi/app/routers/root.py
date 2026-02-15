from fastapi import APIRouter
from ..settings import settings

router = APIRouter()


@router.get("/")
def root():
    return {
        "status": "ok",
        "db": {
            "connection": settings.DB_CONNECTION,
            "database": settings.DB_DATABASE
        }
    }
