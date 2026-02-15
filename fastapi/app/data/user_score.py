from __future__ import annotations
from dataclasses import dataclass, field
from datetime import datetime
from app.label import Label, SubLabelBase
from app.constants import DEFAULT_SCORE

@dataclass
class AIAnalysisResult:
    """What the AI returns after analyzing a user's logged mistake or practice."""
    sublabel: SubLabelBase
    is_improvement: bool  # True = user did well / practiced. False = user made a mistake.
    magnitude: float = 1.0  # 0.0 to 1.0 — how significant the event was.

@dataclass
class LineChartPoint:
    """Single data point for the line chart. Positive delta = improving."""
    timestamp: datetime
    overall_score: float  # Current overall score (0-100)
    delta: float  # Change from previous overall score

@dataclass
class UserScores:
    # Spider chart: 6 label scores (0-100)
    label_scores: dict[Label, float] = field(default_factory=lambda: {
        label: DEFAULT_SCORE for label in Label
    })
    # Sub-label scores populated over time (0-100)
    sublabel_scores: dict[str, float] = field(default_factory=dict)
    # Line chart history
    line_chart_history: list[LineChartPoint] = field(default_factory=list)
