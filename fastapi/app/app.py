from fastapi import FastAPI
from .routers import diagnostic_router, predict_router, questions_router, root_router, scoring_router, embeddings_router

def create_app() -> FastAPI:
    app = FastAPI(title="FastAPI prototype for Laravel")

    app.include_router(root_router)
    app.include_router(predict_router)
    app.include_router(scoring_router)
    app.include_router(questions_router)
    app.include_router(embeddings_router)
    app.include_router(diagnostic_router)

    return app
