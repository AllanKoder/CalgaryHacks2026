from .predict import router as predict_router
from .root import router as root_router
from .scoring import router as scoring_router

__all__ = ["predict_router", "root_router", "scoring_router"]
