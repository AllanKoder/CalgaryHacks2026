from fastapi import FastAPI
from .routers import predict_router, questions_router, root_router, scoring_router

def create_app() -> FastAPI:
    app = FastAPI(title="FastAPI prototype for Laravel")

    app.include_router(root_router)
    app.include_router(predict_router)
    app.include_router(scoring_router)
    app.include_router(questions_router)

    return app
