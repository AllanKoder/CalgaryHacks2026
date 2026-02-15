from fastapi import APIRouter
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from ..database import engine
from ..models import PredictRequest, PredictResponse

router = APIRouter()


@router.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    db_ok = False
    user_count = None

    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
            try:
                result = conn.execute(text("SELECT COUNT(*) FROM users"))
                user_count = result.scalar()
            except SQLAlchemyError:
                user_count = None
            db_ok = True
    except SQLAlchemyError:
        db_ok = False

    pred = {
        "label": "prototype",
        "confidence": 0.5,
        "keys": list(req.payload.keys())
    }

    if user_count is not None:
        try:
            pred["user_count"] = int(user_count)
        except Exception:
            pred["user_count"] = user_count

    return {"prediction": pred, "db_ok": db_ok}
