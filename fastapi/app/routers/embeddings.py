from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.ai_service import generate_embedding, generate_embeddings_batch

router = APIRouter(prefix="/embeddings", tags=["embeddings"])


class EmbeddingRequest(BaseModel):
    text: str


class EmbeddingResponse(BaseModel):
    embedding: list[float]
    dimensions: int


class BatchEmbeddingRequest(BaseModel):
    texts: list[str]


class BatchEmbeddingResponse(BaseModel):
    embeddings: list[list[float]]
    count: int
    dimensions: int


@router.post("/generate", response_model=EmbeddingResponse)
async def create_embedding(request: EmbeddingRequest):
    """
    Generate a 768-dimensional embedding vector for the given text.
    Uses Google Gemini text-embedding-004 model.
    """
    embedding = await generate_embedding(request.text)
    
    if embedding is None:
        raise HTTPException(
            status_code=503,
            detail="Embedding service unavailable. Please check Google API key configuration."
        )
    
    return EmbeddingResponse(
        embedding=embedding,
        dimensions=len(embedding)
    )


@router.post("/generate-batch", response_model=BatchEmbeddingResponse)
async def create_embeddings_batch(request: BatchEmbeddingRequest):
    """
    Generate embeddings for multiple texts in a single request.
    More efficient than multiple individual requests.
    """
    if not request.texts:
        raise HTTPException(status_code=400, detail="No texts provided")
    
    if len(request.texts) > 100:
        raise HTTPException(status_code=400, detail="Maximum 100 texts per batch")
    
    embeddings = await generate_embeddings_batch(request.texts)
    
    if embeddings is None:
        raise HTTPException(
            status_code=503,
            detail="Embedding service unavailable. Please check Google API key configuration."
        )
    
    return BatchEmbeddingResponse(
        embeddings=embeddings,
        count=len(embeddings),
        dimensions=len(embeddings[0]) if embeddings else 0
    )
