from typing import Any, Dict
from pydantic import BaseModel


class PredictRequest(BaseModel):
    payload: Dict[str, Any]


class PredictResponse(BaseModel):
    prediction: Dict[str, Any]
    db_ok: bool = False
