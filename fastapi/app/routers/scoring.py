from typing import Any, Dict, List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.data.user_score import AIAnalysisResult, LineChartPoint, UserScores
from app.label import Label, SubLabelBase
from app.questions import QUIZ_QUESTIONS
from app.scoring_update import (
    LABEL_TO_SUBLABEL_ENUM,
    initialize_from_quiz,
    process_ai_analysis,
)

router = APIRouter(prefix="/scoring", tags=["scoring"])


class QuizSubmission(BaseModel):
    # Mapping of question_id (str) -> answer index (int)
    answers: Dict[str, int]


class UpdateScoreRequest(BaseModel):
    user_scores: UserScores
    ai_sublabel_value: str
    ai_is_improvement: bool
    ai_magnitude: float


def _find_sublabel_enum_member(value: str) -> SubLabelBase:
    """
    Given a string value (e.g., 'emotional_awareness'), search through all
    Label enums to find the corresponding SubLabelBase member object.
    """
    for enum_class in LABEL_TO_SUBLABEL_ENUM.values():
        for member in enum_class:
            if member._value_ == value:
                return member
    raise ValueError(f"Unknown sub-label value: {value}")


@router.post("/init-quiz", response_model=UserScores)
def init_quiz_scores(payload: QuizSubmission):
    """
    Calculate initial scores based on quiz answers.
    """
    # Create a fresh UserScores object
    user = UserScores()

    try:
        updated_user = initialize_from_quiz(
            user=user, questions=QUIZ_QUESTIONS, answers=payload.answers
        )
        return updated_user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/update-scores", response_model=UserScores)
def update_scores_from_ai(payload: UpdateScoreRequest):
    """
    Update existing UserScores based on an AI analysis result.
    """
    try:
        # 1. Reconstruct the SubLabel enum member
        sublabel_enum = _find_sublabel_enum_member(payload.ai_sublabel_value)

        # 2. Reconstruct the AIAnalysisResult object
        analysis = AIAnalysisResult(
            sublabel=sublabel_enum,
            is_improvement=payload.ai_is_improvement,
            magnitude=payload.ai_magnitude,
        )

        # 3. Process the update
        updated_user = process_ai_analysis(payload.user_scores, analysis)

        return updated_user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid sub-label: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
