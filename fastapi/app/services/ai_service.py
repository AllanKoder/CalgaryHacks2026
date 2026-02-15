import os
from pathlib import Path

from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings

from app.data.quiz import QuizQuestion

load_dotenv(Path(__file__).resolve().parents[2] / ".env")

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
