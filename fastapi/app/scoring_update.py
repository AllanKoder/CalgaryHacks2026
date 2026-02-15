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
from app.services.ai_service import (
    generate_quiz_analysis as generate_quiz_analysis_ai_service,
)
from app.services.ai_service import llm as LLM_ai_service

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
    Single number representing the user's state across all 78 sub-labels.
    Severity-weighted average of every sub-label score.

    Formula: Sumation(score_i × severity_i) / Sumation(severity_i)
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


async def initialize_from_quiz(
    user: UserScores,
    questions: list[QuizQuestion],
    answers: dict[str, int],
) -> UserScores:
    """ """
    # 1. Group scores by Label (Category)
    # We create a list of scores for each of the 6 labels
    label_buckets: dict[Label, list[float]] = {label: [] for label in Label}

    for question in questions:
        if question.question_id not in answers:
            continue

        answer_value = answers[question.question_id]

        # Calculate score (0-100 scale)
        if question.question_type == QuizQuestionType.SCENARIO:
            # For scenarios, the score is explicitly defined in the options tuple
            # question.options[index] -> ("text", score)
            score = question.options[answer_value][1]
        else:
            # For AGREE_DISAGREE / SELF_RATING (1-5 scale)
            # Normalize 1-5 to 0-100
            if question.inverted:
                score = (5 - answer_value) / 4 * 100
            else:
                score = (answer_value - 1) / 4 * 100

        label_buckets[question.label].append(score)

    # 2. Update Spider Chart Data (label_scores)
    # We average the 4 questions for each label
    for label, scores in label_buckets.items():
        if scores:
            user.label_scores[label] = round(sum(scores) / len(scores), 1)
        else:
            user.label_scores[label] = DEFAULT_SCORE

    # 3. Generate the Gemini Report
    # We do this before the line chart so the user gets everything at once
    user.initial_report = await generate_quiz_analysis_ai_service(questions, answers)

    # 4. Update Line Graph Data (line_chart_history)
    # _compute_overall_score uses the label_scores we just calculated
    # to create the first data point on the graph.
    initial_overall_score = _compute_overall_score(user)

    user.line_chart_history.append(
        LineChartPoint(
            timestamp=datetime.now(timezone.utc),
            overall_score=initial_overall_score,
            delta=0.0,  # First point has no change
        )
    )

    return user


def update_sublabel_from_ai(
    user: UserScores,
    analysis: AIAnalysisResult,
) -> UserScores:
    """
    Called after the AI analyzes a user's logged event (mistake or practice).

    - Adjusts the specific sub-label score up or down based on severity + magnitude.
    - Computes the new overall score across all 78 sub-labels.
    - Calculates the delta from the previous overall score.
    - Appends a new LineChartPoint (positive delta = improving, negative = declining).

    Args:
        user: Current UserScores.
        analysis: AI's classification — which sub-label, improvement or mistake, how significant.

    Returns:
        Updated UserScores with new sub-label score and line chart data point.
    """
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


def update_label_from_ai(
    user: UserScores,
    label: Label,
) -> UserScores:
    """
    Recalculates a single label's spider chart score from its sub-label scores.

    Formula:
        label_score = Sumation(sublabel_score_i × severity_i) / Sumation(severity_i)

    High-severity sub-labels have more pull on the label score. Sub-labels that
    haven't been directly assessed yet fall back to the quiz baseline.

    Call this AFTER update_sublabel_from_ai to keep the spider chart in sync.

    Args:
        user: Current UserScores.
        label: Which of the 6 labels to recalculate.

    Returns:
        Updated UserScores with recalculated label score.
    """
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


def process_ai_analysis(
    user: UserScores,
    analysis: AIAnalysisResult,
) -> UserScores:
    """
    Single entry point that does both updates in order:
      1. Updates the sub-label score -> new line chart point
      2. Recalculates the parent label score -> spider chart update

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
