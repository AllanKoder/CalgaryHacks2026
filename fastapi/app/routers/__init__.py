from .predict import router as predict_router
from .questions import router as questions_router
from .root import router as root_router
from .scoring import router as scoring_router
from .embeddings import router as embeddings_router

__all__ = ["predict_router", "questions_router", "root_router", "scoring_router", "embeddings_router"]

