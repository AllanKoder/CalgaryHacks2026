"""
FastAPI endpoints for interactive diagnostic conversation system
"""

from typing import Any, Dict, Optional

from diagnostic import (
    format_for_user_scores,
    start_conversation,
    submit_answer,
)
from fastapi import Body, FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()


class AnswerSubmission(BaseModel):
    """Request model for submitting an answer"""

    state: Dict[str, Any]
    answer: str


class ConversationResponse(BaseModel):
    """Response model for conversation flow"""

    question: Optional[str] = None
    question_type: Optional[str] = None
    question_number: Optional[int] = None
    total_questions: Optional[int] = None
    analysis: Optional[Dict[str, Any]] = None
    is_complete: bool = False
    state: Optional[Dict[str, Any]] = None


@app.post("/api/diagnostic/start", response_model=ConversationResponse)
async def start_diagnostic():
    """
    Start a new diagnostic conversation.

    Returns:
        The first primary question and conversation state.

    Example response:
    {
        "question": "What is the main challenge you're currently facing?",
        "question_type": "primary",
        "state": {...}
    }
    """
    try:
        result = await start_conversation()
        return ConversationResponse(**result)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error starting conversation: {str(e)}"
        )


@app.post("/api/diagnostic/answer", response_model=ConversationResponse)
async def submit_diagnostic_answer(submission: AnswerSubmission):
    """
    Submit an answer and get the next question or final analysis.

    Request body:
    {
        "state": {...},  // State from previous response
        "answer": "User's answer to the current question"
    }

    Response (if more questions):
    {
        "question": "Next follow-up question?",
        "question_type": "follow_up",
        "question_number": 2,
        "total_questions": 4,
        "state": {...}
    }

    Response (if complete):
    {
        "analysis": {
            "label_scores": {...},
            "sublabel_scores": {...},
            "summary": {...},
            "overall_score": 65.5
        },
        "is_complete": true
    }
    """
    try:
        result = await submit_answer(
            state_dict=submission.state, answer=submission.answer
        )
        return ConversationResponse(**result)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error processing answer: {str(e)}"
        )


@app.post("/api/diagnostic/format-scores")
async def format_analysis_for_scores(analysis: Dict[str, Any] = Body(...)):
    """
    Format the diagnostic analysis to match UserScores model structure.

    This endpoint converts the AI analysis output into the format
    expected by your UserScores model for database storage.

    Request body:
    {
        "label_scores": {...},
        "sublabel_scores": {...},
        "summary": {...},
        "overall_score": 65.5
    }

    Returns: Formatted data ready for UserScores model
    """
    try:
        formatted = format_for_user_scores(analysis)
        return formatted
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error formatting analysis: {str(e)}"
        )


# Example usage workflow
@app.get("/api/diagnostic/example-flow")
async def example_flow():
    """
    Returns documentation showing the complete conversation flow.
    """
    return {
        "workflow": [
            {
                "step": 1,
                "action": "POST /api/diagnostic/start",
                "description": "Start conversation, get primary question",
                "response": {
                    "question": "What is the main challenge you're currently facing?",
                    "question_type": "primary",
                    "state": {"...": "state object"},
                },
            },
            {
                "step": 2,
                "action": "POST /api/diagnostic/answer",
                "description": "Submit answer to primary question",
                "request": {
                    "state": {"...": "from previous response"},
                    "answer": "I've been struggling with anxiety and procrastination...",
                },
                "response": {
                    "question": "How long have you been experiencing these feelings?",
                    "question_type": "follow_up",
                    "question_number": 1,
                    "total_questions": 4,
                    "state": {"...": "updated state"},
                },
            },
            {
                "step": 3,
                "action": "POST /api/diagnostic/answer",
                "description": "Continue answering follow-up questions (repeat until done)",
                "note": "Keep submitting answers until is_complete: true",
            },
            {
                "step": 4,
                "action": "POST /api/diagnostic/answer (final)",
                "description": "Submit last answer, get complete analysis",
                "response": {
                    "analysis": {
                        "label_scores": {
                            "emotional_mastery": 55.0,
                            "cognitive_clarity": 48.0,
                            "...": "...",
                        },
                        "sublabel_scores": {
                            "anxiety_and_worry": 42.0,
                            "procrastination": 35.0,
                            "...": "...",
                        },
                        "summary": {
                            "overall_assessment": "...",
                            "key_insights": ["...", "..."],
                            "primary_concerns": ["...", "..."],
                            "strengths_identified": ["..."],
                            "recommended_focus": "...",
                        },
                        "overall_score": 58.3,
                    },
                    "is_complete": true,
                },
            },
            {
                "step": 5,
                "action": "POST /api/diagnostic/format-scores",
                "description": "Format analysis for UserScores model (optional)",
                "note": "Use this if you need to convert the analysis to UserScores structure",
            },
        ],
        "notes": [
            "State must be preserved between requests (store in session/database)",
            "The conversation is 1 primary question + 3-5 follow-ups",
            "Analysis is generated after all questions are answered",
            "Scores are 0-100 scale based on conversation evidence",
        ],
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
