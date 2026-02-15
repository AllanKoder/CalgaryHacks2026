from __future__ import annotations

from datetime import datetime, timezone

from app.constants import (
    BASE_PENALTY,
    BASE_REWARD,
    DEFAULT_SCORE,
    MAX_SCORE,
    MIN_SCORE,
    SEVERITY_MULTIPLIER,
)
from app.data.quiz import QuizQuestion, QuizQuestionType
from app.data.user_score import AIAnalysisResult, LineChartPoint, UserScores
from app.label import (
    CognitiveClarity,
    EmotionalMastery,
    EthicalMoral,
    IdentityGrowth,
    Label,
    PhysicalLifestyle,
    SocialRelational,
    SubLabelBase,
)
# from app.services.ai_service import (
#     generate_quiz_analysis as generate_quiz_analysis_ai_service,
# )
# from app.services.ai_service import llm as LLM_ai_service

LABEL_TO_SUBLABEL_ENUM: dict[Label, type[SubLabelBase]] = {
    Label.EMOTIONAL_MASTERY: EmotionalMastery,
    Label.COGNITIVE_CLARITY: CognitiveClarity,
    Label.SOCIAL_RELATIONAL: SocialRelational,
    Label.ETHICAL_MORAL: EthicalMoral,
    Label.PHYSICAL_LIFESTYLE: PhysicalLifestyle,
    Label.IDENTITY_GROWTH: IdentityGrowth,
}


def _clamp(value: float) -> float:
    return max(MIN_SCORE, min(MAX_SCORE, value))


def _get_sublabel_score(user: UserScores, sublabel: SubLabelBase) -> float:
    """Get a sub-label's score. Falls back to parent label score if unassessed."""
    if sublabel.value in user.sublabel_scores:
        return user.sublabel_scores[sublabel.value]
    return user.label_scores.get(sublabel.label, DEFAULT_SCORE)


def _compute_overall_score(user: UserScores) -> float:
    """
    Formula: Sumation(score_i x severity_i) / Sumation(severity_i)
    """
    weighted_sum = 0.0
    total_weight = 0.0

    for label, enum_class in LABEL_TO_SUBLABEL_ENUM.items():
        for member in enum_class:
            score = _get_sublabel_score(user, member)
            weight = member.severity
            weighted_sum += score * weight
            total_weight += weight

    return round(weighted_sum / total_weight, 2) if total_weight > 0 else DEFAULT_SCORE


def initialize_from_quiz(user: UserScores,questions: list[QuizQuestion],answers: dict[str, int]) -> UserScores:
    label_buckets: dict[Label, list[float]] = {label: [] for label in Label}

    for question in questions:
        if question.question_id not in answers:
            continue

        answer_value = answers[question.question_id]

        # Calculate score (0-100 scale)
        if question.question_type == QuizQuestionType.SCENARIO:
            score = question.options[answer_value][1]
        else:
            # For AGREE_DISAGREE / SELF_RATING (1-5 scale)
            if question.inverted:
                score = (5 - answer_value) / 4 * 100
            else:
                score = (answer_value - 1) / 4 * 100

        label_buckets[question.label].append(score)

    for label, scores in label_buckets.items():
        if scores:
            user.label_scores[label] = round(sum(scores) / len(scores), 1)
        else:
            user.label_scores[label] = DEFAULT_SCORE

    initial_overall_score = _compute_overall_score(user)

    user.line_chart_history.append(
        LineChartPoint(
            timestamp=datetime.now(timezone.utc),
            overall_score=initial_overall_score,
            delta=0.0,  # First point has no change
        )
    )
    return user

def update_sublabel_from_ai( user: UserScores, analysis: AIAnalysisResult) -> UserScores:
    sublabel = analysis.sublabel
    current = _get_sublabel_score(user, sublabel)
    severity = sublabel.severity

    if analysis.is_improvement:
        # Reward: base + severity bonus, scaled by magnitude
        change = (BASE_REWARD + severity * SEVERITY_MULTIPLIER) * analysis.magnitude
        new_score = _clamp(current + change)
    else:
        # Penalty: base + severity bonus, scaled by magnitude
        change = (BASE_PENALTY + severity * SEVERITY_MULTIPLIER) * analysis.magnitude
        new_score = _clamp(current - change)

    user.sublabel_scores[sublabel.value] = round(new_score, 2)

    # Compute new overall score and delta
    previous_overall = (
        user.line_chart_history[-1].overall_score
        if user.line_chart_history
        else DEFAULT_SCORE
    )
    new_overall = _compute_overall_score(user)
    delta = round(new_overall - previous_overall, 2)

    user.line_chart_history.append(
        LineChartPoint(
            timestamp=datetime.now(timezone.utc),
            overall_score=new_overall,
            delta=delta,
        )
    )

    return user


def update_label_from_ai( user: UserScores, label: Label) -> UserScores:
    enum_class = LABEL_TO_SUBLABEL_ENUM[label]

    weighted_sum = 0.0
    total_weight = 0.0

    for member in enum_class:
        score = _get_sublabel_score(user, member)
        weight = member.severity
        weighted_sum += score * weight
        total_weight += weight

    if total_weight > 0:
        user.label_scores[label] = round(weighted_sum / total_weight, 1)

    return user


def process_ai_analysis( user: UserScores, analysis: AIAnalysisResult) -> UserScores:
    """
    Use this instead of calling update_sublabel_from_ai + update_label_from_ai separately.
    """
    user = update_sublabel_from_ai(user, analysis)
    user = update_label_from_ai(user, analysis.sublabel.label)
    return user


def get_spider_chart_data(user: UserScores) -> dict[str, float]:
    """Returns {label_name: score} for rendering the spider chart."""
    return {label.value: score for label, score in user.label_scores.items()}


def get_line_chart_data(user: UserScores) -> list[dict]:
    """
    Returns the line chart series.
    Each point has: timestamp, overall_score, delta.
    Positive delta = improvement, negative = decline.
    Zero line = no change from previous.
    """
    return [
        {
            "timestamp": point.timestamp.isoformat(),
            "overall_score": point.overall_score,
            "delta": point.delta,
        }
        for point in user.line_chart_history
    ]
