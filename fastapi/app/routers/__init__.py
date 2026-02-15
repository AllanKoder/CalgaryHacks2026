from .predict import router as predict_router
from .questions import router as questions_router
from .root import router as root_router

__all__ = ["predict_router", "questions_router", "root_router"]
