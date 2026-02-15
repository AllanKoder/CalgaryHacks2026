import os

from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

from app.data.quiz import QuizQuestion

# Initialize Gemini (Ensure GOOGLE_API_KEY is in your .env)
# Using 'gemini-1.5-flash' for speed, or 'gemini-1.5-pro' for deeper analysis
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.7)


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
    chain = prompt | llm
    try:
        response = await chain.ainvoke({"transcript": transcript})
        return response.content
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return (
            "Your personalized analysis is being prepared. Please check back shortly."
        )
