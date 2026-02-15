from enum import Enum
import os
from pathlib import Path

from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings

from app.data.quiz import QuizQuestion

load_dotenv(Path(__file__).resolve().parents[3] / ".env")


def get_llm():
    api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None
    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0.7,
        api_key=api_key,
    )


def get_embeddings():
    """Get Google Gemini embeddings model"""
    api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None
    return GoogleGenerativeAIEmbeddings(
        model="models/text-embedding-004",
        api_key=api_key,
    )


async def generate_quiz_analysis(
    questions: list[QuizQuestion], answers: dict[str, int]
) -> str:
    """
    Uses Google Gemini to analyze quiz answers and provide a personality profile.
    """

    # 1. Prepare the transcript
    transcript = ""
    for q in questions:
        ans_idx = answers.get(q.question_id)
        if ans_idx is None:
            continue

        user_choice = ""
        if q.options:
            # For scenario questions, we get the text of the chosen option
            user_choice = q.options[ans_idx][0]
        else:
            # For scales, ans_idx is the raw 1-5 rating
            user_choice = f"Rating: {ans_idx}/5"

        transcript += f"Category: {q.label.value}\nQuestion: {q.text}\nUser Answer: {user_choice}\n\n"

    # 2. Create the Prompt
    prompt = ChatPromptTemplate.from_template("""
        You are a high-performance coach and behavioral psychologist.
        A user has just completed an onboarding quiz for a growth platform.

        Analyze these quiz results:
        {transcript}

        Provide a "Mindset Analysis" report in Json format:
        1. **The Core Profile**: A 2-sentence summary of their current psychological state.
        2. **Primary Strength**: Identify the category where they show the most maturity.
        3. **The Growth Edge**: Identify one specific area (with reasoning) that they should prioritize.
        4. **First Step**: One practical, small action they can take today.

        Keep the tone encouraging, professional, and insightful.
    """)

    # 3. Execute with Gemini
    llm = get_llm()
    if llm is None:
        return (
            "AI analysis is unavailable until a Gemini API key is configured. "
            "Please set GOOGLE_API_KEY or GEMINI_API_KEY."
        )

    chain = prompt | llm
    try:
        response = await chain.ainvoke({"transcript": transcript})
        return response.content
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return (
            "Your personalized analysis is being prepared. Please check back shortly."
        )


async def generate_embedding(text: str) -> list[float] | None:
    """
    Generate a 768-dimensional embedding vector for the given text using Google Gemini.

    Args:
        text: The text to embed

    Returns:
        A list of 768 floats, or None if the API is unavailable
    """
    embeddings_model = get_embeddings()
    if embeddings_model is None:
        return None

    try:
        # LangChain's embed_query returns a list of floats
        vector = await embeddings_model.aembed_query(text)
        return vector
    except Exception as e:
        print(f"Embedding generation error: {e}")
        return None


async def generate_embeddings_batch(texts: list[str]) -> list[list[float]] | None:
    """
    Generate embeddings for multiple texts in a batch.

    Args:
        texts: List of texts to embed

    Returns:
        List of embedding vectors, or None if the API is unavailable
    """
    embeddings_model = get_embeddings()
    if embeddings_model is None:
        return None

    try:
        vectors = await embeddings_model.aembed_documents(texts)
        return vectors
    except Exception as e:
        print(f"Batch embedding generation error: {e}")
        return None


class Label(Enum):
    EMOTIONAL_MASTERY = "emotional_mastery"
    COGNITIVE_CLARITY = "cognitive_clarity"
    SOCIAL_RELATIONAL = "social_relational"
    ETHICAL_MORAL = "ethical_moral"
    PHYSICAL_LIFESTYLE = "physical_lifestyle"
    IDENTITY_GROWTH = "identity_growth"


class SubLabelBase(Enum):
    severity: int

    def __init__(self, value: str, severity: int) -> None:
        self._value_ = value
        self.severity = severity

    @property
    def label(self) -> Label:
        raise NotImplementedError


class EmotionalMastery(SubLabelBase):
    EMOTIONAL_AWARENESS = ("emotional_awareness", 3)
    ANGER_MANAGEMENT = ("anger_management", 6)
    ANXIETY_AND_WORRY = ("anxiety_and_worry", 5)
    EMOTIONAL_SUPPRESSION = ("emotional_suppression", 5)
    JEALOUSY_AND_ENVY = ("jealousy_and_envy", 5)
    EMOTIONAL_DEPENDENCY = ("emotional_dependency", 4)
    GRIEF_AND_LOSS_PROCESSING = ("grief_and_loss_processing", 4)
    FRUSTRATION_TOLERANCE = ("frustration_tolerance", 4)
    SHAME_AND_GUILT_SPIRALS = ("shame_and_guilt_spirals", 6)
    MOOD_VOLATILITY = ("mood_volatility", 5)
    GRUDGE_HOLDING_AND_UNFORGIVENESS = ("grudge_holding_and_unforgiveness", 5)
    IMPULSIVITY = ("impulsivity", 6)

    @property
    def label(self) -> Label:
        return Label.EMOTIONAL_MASTERY


class CognitiveClarity(SubLabelBase):
    CONFIRMATION_BIAS = ("confirmation_bias", 5)
    BLACK_AND_WHITE_THINKING = ("black_and_white_thinking", 4)
    CATASTROPHIZING = ("catastrophizing", 5)
    OVERTHINKING_AND_RUMINATION = ("overthinking_and_rumination", 4)
    DUNNING_KRUGER_OVERCONFIDENCE = ("dunning_kruger_overconfidence", 5)
    SUNK_COST_FALLACY = ("sunk_cost_fallacy", 4)
    ATTRIBUTION_ERRORS = ("attribution_errors", 5)
    NEGATIVITY_BIAS = ("negativity_bias", 4)
    ANCHORING_BIAS = ("anchoring_bias", 3)
    SELF_SERVING_BIAS = ("self_serving_bias", 5)
    HINDSIGHT_BIAS = ("hindsight_bias", 3)
    BANDWAGON_EFFECT = ("bandwagon_effect", 4)
    PROJECTION = ("projection", 5)
    INDECISIVENESS_AND_DECISION_PARALYSIS = (
        "indecisiveness_and_decision_paralysis", 4)

    @property
    def label(self) -> Label:
        return Label.COGNITIVE_CLARITY


class SocialRelational(SubLabelBase):
    EMPATHY_DEFICIT = ("empathy_deficit", 6)
    POOR_COMMUNICATION = ("poor_communication", 4)
    ACTIVE_LISTENING_FAILURE = ("active_listening_failure", 3)
    CONFLICT_AVOIDANCE = ("conflict_avoidance", 4)
    DESTRUCTIVE_CONFLICT = ("destructive_conflict", 6)
    BOUNDARY_VIOLATION = ("boundary_violation", 7)
    INABILITY_TO_SET_BOUNDARIES = ("inability_to_set_boundaries", 4)
    PEOPLE_PLEASING = ("people_pleasing", 4)
    SOCIAL_MANIPULATION = ("social_manipulation", 8)
    PASSIVE_AGGRESSION = ("passive_aggression", 5)
    ISOLATION_AND_WITHDRAWAL = ("isolation_and_withdrawal", 5)
    CODEPENDENCY = ("codependency", 5)
    GOSSIP_AND_BACKBITING = ("gossip_and_backbiting", 5)
    BULLYING_AND_INTIMIDATION = ("bullying_and_intimidation", 7)
    TRUST_ISSUES_AND_SUSPICION = ("trust_issues_and_suspicion", 5)

    @property
    def label(self) -> Label:
        return Label.SOCIAL_RELATIONAL


class EthicalMoral(SubLabelBase):
    MISOGYNY_GENDER_DISRESPECT = ("misogyny_gender_disrespect", 8)
    RACISM_ETHNIC_PREJUDICE = ("racism_ethnic_prejudice", 9)
    HOMOPHOBIA_LGBTQ_PREJUDICE = ("homophobia_lgbtq_prejudice", 8)
    RELIGIOUS_CULTURAL_INTOLERANCE = ("religious_cultural_intolerance", 7)
    CLASS_DISABILITY_PREJUDICE = ("class_disability_prejudice", 7)
    DISHONESTY_AND_DECEPTION = ("dishonesty_and_deception", 7)
    LACK_OF_ACCOUNTABILITY = ("lack_of_accountability", 6)
    ENTITLEMENT_AND_SELFISHNESS = ("entitlement_and_selfishness", 6)
    CRUELTY_AND_CALLOUSNESS = ("cruelty_and_callousness", 9)
    HYPOCRISY = ("hypocrisy", 5)

    @property
    def label(self) -> Label:
        return Label.ETHICAL_MORAL


class PhysicalLifestyle(SubLabelBase):
    PHYSICAL_INACTIVITY = ("physical_inactivity", 4)
    POOR_NUTRITION = ("poor_nutrition", 4)
    SLEEP_NEGLECT = ("sleep_neglect", 4)
    SUBSTANCE_MISUSE = ("substance_misuse", 8)
    SCREEN_AND_DIGITAL_ADDICTION = ("screen_and_digital_addiction", 5)
    PROCRASTINATION = ("procrastination", 4)
    POOR_TIME_MANAGEMENT = ("poor_time_management", 3)
    FINANCIAL_IRRESPONSIBILITY = ("financial_irresponsibility", 5)
    HYGIENE_AND_SELF_CARE_NEGLECT = ("hygiene_and_self_care_neglect", 4)
    WORKAHOLISM = ("workaholism", 5)
    ATTENTION_AND_FOCUS_DEFICIT = ("attention_and_focus_deficit", 4)
    SEXUAL_COMPULSIVITY = ("sexual_compulsivity", 6)

    @property
    def label(self) -> Label:
        return Label.PHYSICAL_LIFESTYLE


class IdentityGrowth(SubLabelBase):
    LOW_SELF_CONFIDENCE = ("low_self_confidence", 3)
    LOW_SELF_WORTH = ("low_self_worth", 5)
    IMPOSTOR_SYNDROME = ("impostor_syndrome", 3)
    TOXIC_PERFECTIONISM = ("toxic_perfectionism", 4)
    FEAR_OF_FAILURE = ("fear_of_failure", 4)
    FEAR_OF_REJECTION = ("fear_of_rejection", 4)
    LACK_OF_PURPOSE = ("lack_of_purpose", 5)
    VICTIM_MENTALITY = ("victim_mentality", 6)
    FIXED_MINDSET = ("fixed_mindset", 5)
    LEARNED_HELPLESSNESS = ("learned_helplessness", 5)
    COMPLACENCY = ("complacency", 3)
    IDENTITY_FRAGILITY = ("identity_fragility", 4)
    INABILITY_TO_ASK_FOR_HELP = ("inability_to_ask_for_help", 4)
    MATERIALISM_AND_STATUS_OBSESSION = ("materialism_and_status_obsession", 5)
    SPIRITUAL_EXISTENTIAL_DISCONNECTION = (
        "spiritual_existential_disconnection", 4)

    @property
    def label(self) -> Label:
        return Label.IDENTITY_GROWTH
