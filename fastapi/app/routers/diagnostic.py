from typing import Any, Dict, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.diagnostic import (
    analyze_conversation_and_score,
    generate_follow_up_questions,
)

router = APIRouter(prefix="/diagnostic", tags=["diagnostic"])


class StartRequest(BaseModel):
    user_input: str
    current_scores: Optional[Dict[str, float]] = None
    event_context: Optional[Dict[str, Any]] = None


class StartResponse(BaseModel):
    question: str
    state: Dict[str, Any]


class AnswerRequest(BaseModel):
    state: Dict[str, Any]
    answer: str
    current_scores: Optional[Dict[str, float]] = None
    event_context: Optional[Dict[str, Any]] = None


class AnswerResponse(BaseModel):
    analysis: Dict[str, Any]
    is_complete: bool


@router.post("/start", response_model=StartResponse)
async def diagnostic_start(payload: StartRequest):
    """
    User provides their concern/input along with the full reflection/event context.
    AI generates ONE targeted follow-up question.
    """
    user_input = payload.user_input.strip()
    if not user_input:
        raise HTTPException(status_code=400, detail="user_input cannot be empty")

    try:
        questions = await generate_follow_up_questions(
            primary_question="What is on your mind?",
            primary_answer=user_input,
            current_scores=payload.current_scores,
            event_context=payload.event_context,
        )

        question = questions[0] if questions else "Can you tell me more about how this affects your daily life?"

        state = {
            "user_input": user_input,
            "ai_question": question,
            "conversation_history": [
                {"question": "What is on your mind?", "answer": user_input},
            ],
        }

        return StartResponse(question=question, state=state)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate question: {str(e)}")


@router.post("/answer", response_model=AnswerResponse)
async def diagnostic_answer(payload: AnswerRequest):
    """
    User answers the AI's question. AI reviews the full conversation, the user's
    existing profile, and the original reflection/event context, then returns
    the analysis with updated scores and summary.
    """
    state = payload.state
    answer = payload.answer.strip()

    if not answer:
        raise HTTPException(status_code=400, detail="answer cannot be empty")

    ai_question = state.get("ai_question", "")
    conversation_history = state.get("conversation_history", [])

    conversation_history.append({"question": ai_question, "answer": answer})

    try:
        analysis = await analyze_conversation_and_score(
            conversation_history,
            current_scores=payload.current_scores,
            event_context=payload.event_context,
        )

        if "error" in analysis:
            raise HTTPException(status_code=500, detail=analysis["error"])

        return AnswerResponse(analysis=analysis, is_complete=True)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
