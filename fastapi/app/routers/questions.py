from fastapi import APIRouter
from ..questions import QUIZ_QUESTIONS

router = APIRouter()


def _serialize_question(question):
    return {
        "id": question.question_id,
        "label": question.label.value,
        "type": question.question_type.value,
        "text": question.text,
        "options": (
            [{"text": option, "score": score} for option, score in question.options]
            if question.options
            else None
        ),
        "inverted": question.inverted,
    }


@router.get("/questions")
def questions():
    return {"questions": [_serialize_question(question) for question in QUIZ_QUESTIONS]}
