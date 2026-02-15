from __future__ import annotations
from dataclasses import dataclass
from enum import Enum
from app.label import Label

class QuizQuestionType(Enum):
    SCENARIO = "scenario"
    AGREE_DISAGREE = "agree_disagree"
    SELF_RATING = "self_rating"

@dataclass
class QuizQuestion:
    question_id: str
    label: Label
    question_type: QuizQuestionType
    text: str
    options: list[tuple[str, float]] | None = None  # For SCENARIO: (text, score)
    inverted: bool = False  # For scales: True if high answer = bad
