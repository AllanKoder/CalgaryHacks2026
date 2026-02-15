import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

from app.constants import DEFAULT_SCORE
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

load_dotenv(Path(__file__).resolve().parents[3] / ".env")

LABEL_TO_SUBLABEL_ENUM = {
    Label.EMOTIONAL_MASTERY: EmotionalMastery,
    Label.COGNITIVE_CLARITY: CognitiveClarity,
    Label.SOCIAL_RELATIONAL: SocialRelational,
    Label.ETHICAL_MORAL: EthicalMoral,
    Label.PHYSICAL_LIFESTYLE: PhysicalLifestyle,
    Label.IDENTITY_GROWTH: IdentityGrowth,
}


def get_llm():
    api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None
    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0.7,
        api_key=api_key,
    )


async def generate_primary_question() -> str:
    """
    Generate the initial broad question to understand the user's primary concern.
    """
    llm = get_llm()
    if llm is None:
        return "What is the main challenge or problem you're currently facing in your life?"

    prompt = ChatPromptTemplate.from_template("""
        You are a skilled psychologist conducting an initial assessment.

        Generate ONE open-ended question that helps understand the user's primary concern or challenge.
        The question should be:
        - Broad enough to allow them to share what's most important
        - Empathetic and non-judgmental
        - Focused on their current state or recent struggles

        Return ONLY the question text, nothing else.
    """)

    chain = prompt | llm
    try:
        response = await chain.ainvoke({})
        return response.content.strip()
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return "What is the main challenge or problem you're currently facing in your life?"


def _build_event_context_str(event_context: Optional[Dict[str, Any]]) -> str:
    """Build a human-readable string from the event/reflection context dict."""
    if not event_context:
        return ""

    parts = ["REFLECTION / EVENT CONTEXT (the situation the user is reflecting on):"]
    if event_context.get("title"):
        parts.append(f"- Title: {event_context['title']}")
    if event_context.get("focus"):
        parts.append(f"- Focus Area: {event_context['focus']}")
    if event_context.get("description"):
        parts.append(f"- Description: {event_context['description']}")
    if event_context.get("emotional_severity"):
        parts.append(f"- Emotional Severity: {event_context['emotional_severity']}/5")
    if event_context.get("triggers"):
        parts.append(f"- Triggers: {event_context['triggers']}")
    if event_context.get("occurred_at"):
        parts.append(f"- Occurred At: {event_context['occurred_at']}")

    ctx = event_context.get("context")
    if isinstance(ctx, dict):
        for key, val in ctx.items():
            if val:
                label = key.replace("_", " ").title()
                parts.append(f"- {label}: {val}")

    impact = event_context.get("impact")
    if isinstance(impact, dict):
        for key, val in impact.items():
            if val:
                label = key.replace("_", " ").title()
                parts.append(f"- {label}: {val}")

    ident = event_context.get("identification")
    if isinstance(ident, dict):
        if ident.get("tag"):
            parts.append(f"- Category Tag: {ident['tag']}")
        if ident.get("main_category"):
            parts.append(f"- Main Category: {ident['main_category']}")
        if ident.get("sub_category"):
            parts.append(f"- Sub Category: {ident['sub_category']}")
        if ident.get("assumptions"):
            parts.append(f"- Assumptions: {json.dumps(ident['assumptions'])}")
        if ident.get("pattern_recognition"):
            parts.append(f"- Pattern Recognition: {json.dumps(ident['pattern_recognition'])}")

    learning = event_context.get("learning")
    if isinstance(learning, dict):
        if learning.get("action_plan"):
            parts.append(f"- Action Plan: {learning['action_plan']}")
        if learning.get("next_time_strategy"):
            parts.append(f"- Next Time Strategy: {learning['next_time_strategy']}")

    return "\n".join(parts) + "\n"


def _build_scores_context_str(current_scores: Optional[Dict[str, float]]) -> str:
    """Build a human-readable string from the user's current label scores."""
    if not current_scores:
        return ""

    label_names = {
        "emotional_mastery": "Emotional Mastery",
        "cognitive_clarity": "Cognitive Clarity",
        "social_relational": "Social & Relational",
        "ethical_moral": "Ethical & Moral",
        "physical_lifestyle": "Physical & Lifestyle",
        "identity_growth": "Identity & Growth",
    }
    lines = ["USER'S CURRENT PSYCHOLOGICAL PROFILE (scores 0-100, higher is healthier):"]
    for key, score in current_scores.items():
        display = label_names.get(key, key)
        lines.append(f"- {display}: {score}/100")
    return "\n".join(lines) + "\n"


async def generate_follow_up_questions(
    primary_question: str,
    primary_answer: str,
    conversation_history: List[Dict[str, str]] = None,
    current_scores: Optional[Dict[str, float]] = None,
    event_context: Optional[Dict[str, Any]] = None,
) -> List[str]:
    """
    Generate 3-5 critical thinking follow-up questions based on the user's answer,
    their existing psychological profile, and the reflection/event they are consulting about.
    """
    llm = get_llm()
    if llm is None:
        return [
            "How long have you been experiencing this?",
            "What triggers or situations make this worse?",
            "How is this affecting your relationships and daily life?",
        ]

    conversation_context = ""
    if conversation_history:
        for msg in conversation_history:
            conversation_context += f"Q: {msg['question']}\nA: {msg['answer']}\n\n"

    scores_context = _build_scores_context_str(current_scores)
    event_context_str = _build_event_context_str(event_context)

    prompt = ChatPromptTemplate.from_template("""
        You are a psychologist conducting a diagnostic interview.

        {event_context_str}

        {scores_context}

        Initial Question: {primary_question}
        User's Answer: {primary_answer}

        Previous Conversation:
        {conversation_context}

        Based on the reflection context, their existing psychological profile, and their response,
        generate 3-5 critical thinking follow-up questions that:
        1. Reference specific details from their reflection (triggers, context, impact)
        2. Dig deeper into areas where their profile shows lower scores
        3. Assess emotional regulation, cognitive patterns, relationships, lifestyle, and identity
        4. Are specific and actionable (avoid generic questions)
        5. Build on what they've already shared

        Return the questions as a JSON array of strings.
        Example: ["Question 1?", "Question 2?", "Question 3?"]

        IMPORTANT: Return ONLY valid JSON array, no markdown, no extra text.
    """)

    chain = prompt | llm
    try:
        response = await chain.ainvoke(
            {
                "primary_question": primary_question,
                "primary_answer": primary_answer,
                "conversation_context": conversation_context,
                "scores_context": scores_context,
                "event_context_str": event_context_str,
            }
        )

        content = response.content.strip()
        # Clean markdown if present
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
        content = content.strip()

        questions = json.loads(content)
        return questions if isinstance(questions, list) else []

    except Exception as e:
        print(f"Gemini API Error: {e}")
        return [
            "How long have you been experiencing this?",
            "What triggers or situations make this worse?",
            "How is this affecting your daily functioning?",
        ]


async def analyze_conversation_and_score(
    conversation_history: List[Dict[str, str]],
    current_scores: Optional[Dict[str, float]] = None,
    event_context: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Analyze the complete conversation and generate:
    1. Scores for each label (0-100)
    2. Scores for relevant sublabels (0-100)
    3. A comprehensive summary
    current_scores provides the user's existing profile as a baseline.
    event_context provides the full reflection/event the user is consulting about.
    """
    llm = get_llm()
    if llm is None:
        return {
            "error": "AI analysis unavailable. Please configure GOOGLE_API_KEY or GEMINI_API_KEY."
        }

    # Build conversation transcript
    transcript = ""
    for i, msg in enumerate(conversation_history, 1):
        transcript += f"Q{i}: {msg['question']}\nA{i}: {msg['answer']}\n\n"

    # Get all possible sublabels for reference
    all_sublabels = {}
    for label, enum_class in LABEL_TO_SUBLABEL_ENUM.items():
        for member in enum_class:
            all_sublabels[member.value] = {
                "parent_label": label.value,
                "severity": member.severity,
            }

    scores_context = _build_scores_context_str(current_scores)
    if scores_context:
        scores_context += (
            "\nIMPORTANT: Use these previous scores as a baseline. Your new scores should reflect "
            "how this conversation changes or confirms the user's profile. If the conversation "
            "reveals growth in an area, the score should increase. If it reveals new struggles, "
            "the score should decrease. For areas not discussed, keep scores close to the baseline.\n"
        )

    event_context_str = _build_event_context_str(event_context)

    prompt = ChatPromptTemplate.from_template("""
        You are an expert psychologist analyzing a diagnostic conversation.

        {event_context_str}

        {scores_context}

        CONVERSATION TRANSCRIPT:
        {transcript}

        PSYCHOLOGICAL FRAMEWORK:
        Labels (Categories):
        - emotional_mastery: Emotional awareness, regulation, and resilience
        - cognitive_clarity: Thinking patterns, biases, and mental clarity
        - social_relational: Relationships, communication, boundaries
        - ethical_moral: Values, integrity, respect for others
        - physical_lifestyle: Health habits, time management, self-care
        - identity_growth: Self-worth, purpose, mindset, personal development

        Available Sublabels:
        {sublabels}

        TASK:
        Analyze the reflection context AND the conversation to provide updated scores.
        The reflection details (description, triggers, context, impact, severity) are
        critical evidence — weigh them alongside the conversation responses.

        SCORING GUIDELINES (0-100 scale):
        - 80-100: Strong/Healthy - Clear strengths, good functioning
        - 60-79: Moderate - Functioning well with some room for growth
        - 40-59: Developing - Clear struggles, needs attention
        - 20-39: Challenged - Significant difficulties, priority concern
        - 0-19: Critical - Severe issues requiring immediate support

        Consider:
        - The user's existing scores as a starting point
        - The reflection event details (severity, triggers, context, impact)
        - Direct statements about struggles or strengths in the conversation
        - Patterns in their responses (avoidance, blame, insight, etc.)
        - Impact on their life (mild inconvenience vs major dysfunction)
        - Duration and persistence of issues
        - Coping mechanisms present or absent

        Generate a JSON response with this EXACT structure:
        {{
            "label_scores": {{
                "emotional_mastery": float (0-100),
                "cognitive_clarity": float (0-100),
                "social_relational": float (0-100),
                "ethical_moral": float (0-100),
                "physical_lifestyle": float (0-100),
                "identity_growth": float (0-100)
            }},
            "sublabel_scores": {{
                "sublabel_name": float (0-100),
                // Include 3-8 most relevant sublabels based on conversation and reflection
            }},
            "summary": {{
                "overall_assessment": "2-3 sentences about their current state based on both the reflection and conversation",
                "key_insights": [
                    "Specific insight 1 from their reflection and responses",
                    "Specific insight 2 from their reflection and responses",
                    "Specific insight 3 from their reflection and responses"
                ],
                "primary_concerns": [
                    "Most urgent concern area",
                    "Secondary concern if present"
                ],
                "strengths_identified": [
                    "Clear strength or healthy pattern observed"
                ],
                "recommended_focus": "The ONE area they should prioritize first and why"
            }},
            "overall_score": float (0-100, weighted average considering severity)
        }}

        CRITICAL RULES:
        1. Base scores on the reflection context, the conversation, AND the user's existing profile
        2. If an area wasn't discussed, keep scores close to the user's existing baseline (or 70.0 if no baseline)
        3. Be specific in the summary - reference actual things from the reflection and conversation
        4. Include sublabel_scores only for areas clearly revealed
        5. Return ONLY valid JSON, no markdown, no code blocks, no extra text
    """)

    chain = prompt | llm
    try:
        response = await chain.ainvoke(
            {
                "transcript": transcript,
                "sublabels": json.dumps(all_sublabels, indent=2),
                "scores_context": scores_context,
                "event_context_str": event_context_str,
            }
        )

        content = response.content.strip()
        # Clean markdown if present
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
        content = content.strip()

        analysis = json.loads(content)

        # Validate structure
        if "label_scores" not in analysis:
            raise ValueError("Missing label_scores in response")

        # Ensure all labels are present
        for label in Label:
            if label.value not in analysis["label_scores"]:
                analysis["label_scores"][label.value] = DEFAULT_SCORE

        # Add metadata
        analysis["timestamp"] = datetime.now(timezone.utc).isoformat()
        analysis["conversation_length"] = len(conversation_history)

        return analysis

    except json.JSONDecodeError as e:
        print(f"JSON Parse Error: {e}")
        print(f"Response content: {response.content}")
        return {
            "error": "Failed to parse AI response",
            "raw_response": response.content,
        }
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return {"error": f"Analysis failed: {str(e)}"}


class ConversationState:
    """Manages the state of the diagnostic conversation."""

    def __init__(self):
        self.primary_question: Optional[str] = None
        self.primary_answer: Optional[str] = None
        self.follow_up_questions: List[str] = []
        self.conversation_history: List[Dict[str, str]] = []
        self.current_question_index: int = 0
        self.is_complete: bool = False
        self.final_analysis: Optional[Dict[str, Any]] = None

    def to_dict(self) -> Dict[str, Any]:
        """Serialize state for storage/API response."""
        return {
            "primary_question": self.primary_question,
            "primary_answer": self.primary_answer,
            "follow_up_questions": self.follow_up_questions,
            "conversation_history": self.conversation_history,
            "current_question_index": self.current_question_index,
            "is_complete": self.is_complete,
            "final_analysis": self.final_analysis,
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "ConversationState":
        """Deserialize state from storage."""
        state = cls()
        state.primary_question = data.get("primary_question")
        state.primary_answer = data.get("primary_answer")
        state.follow_up_questions = data.get("follow_up_questions", [])
        state.conversation_history = data.get("conversation_history", [])
        state.current_question_index = data.get("current_question_index", 0)
        state.is_complete = data.get("is_complete", False)
        state.final_analysis = data.get("final_analysis")
        return state


async def start_conversation() -> Dict[str, Any]:
    """
    Start a new diagnostic conversation.
    Returns the first question and conversation state.
    """
    state = ConversationState()
    state.primary_question = await generate_primary_question()

    return {
        "question": state.primary_question,
        "question_type": "primary",
        "state": state.to_dict(),
    }


async def submit_answer(state_dict: Dict[str, Any], answer: str) -> Dict[str, Any]:
    """
    Submit an answer and get the next question or final analysis.

    Returns:
        - If more questions: {"question": str, "question_type": str, "state": dict}
        - If complete: {"analysis": dict, "is_complete": True}
    """
    state = ConversationState.from_dict(state_dict)

    # Handle primary answer
    if state.primary_answer is None:
        state.primary_answer = answer
        state.conversation_history.append(
            {"question": state.primary_question, "answer": answer}
        )

        # Generate follow-up questions
        state.follow_up_questions = await generate_follow_up_questions(
            state.primary_question, state.primary_answer
        )
        state.current_question_index = 0

        if not state.follow_up_questions:
            # If no follow-ups, analyze immediately
            state.final_analysis = await analyze_conversation_and_score(
                state.conversation_history
            )
            state.is_complete = True

            return {"analysis": state.final_analysis, "is_complete": True}

        return {
            "question": state.follow_up_questions[0],
            "question_type": "follow_up",
            "question_number": 1,
            "total_questions": len(state.follow_up_questions),
            "state": state.to_dict(),
        }

    # Handle follow-up answer
    current_question = state.follow_up_questions[state.current_question_index]
    state.conversation_history.append({"question": current_question, "answer": answer})
    state.current_question_index += 1

    # Check if more questions
    if state.current_question_index < len(state.follow_up_questions):
        next_question = state.follow_up_questions[state.current_question_index]

        return {
            "question": next_question,
            "question_type": "follow_up",
            "question_number": state.current_question_index + 1,
            "total_questions": len(state.follow_up_questions),
            "state": state.to_dict(),
        }

    # All questions answered - generate analysis
    state.final_analysis = await analyze_conversation_and_score(
        state.conversation_history
    )
    state.is_complete = True

    return {
        "analysis": state.final_analysis,
        "is_complete": True,
        "state": state.to_dict(),
    }


# Utility function to format analysis for UserScores model
def format_for_user_scores(analysis: Dict[str, Any]) -> Dict[str, Any]:
    """
    Format the AI analysis output to match the UserScores model structure.
    """
    if "error" in analysis:
        return analysis

    return {
        "label_scores": {
            Label[label_name.upper()]: score
            for label_name, score in analysis.get("label_scores", {}).items()
        },
        "sublabel_scores": analysis.get("sublabel_scores", {}),
        "overall_score": analysis.get("overall_score", DEFAULT_SCORE),
        "summary": analysis.get("summary", {}),
        "timestamp": analysis.get("timestamp"),
        "line_chart_history": [
            {
                "timestamp": analysis.get("timestamp"),
                "overall_score": analysis.get("overall_score", DEFAULT_SCORE),
                "delta": 0.0,  # First assessment
            }
        ],
    }
