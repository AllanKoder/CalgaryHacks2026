"""
24 onboarding quiz questions — 4 per label.
Mix of scenario-based, agree/disagree, and self-rating formats.
"""

from app.data.quiz import QuizQuestion, QuizQuestionType
from app.label import Label

QUIZ_QUESTIONS: list[QuizQuestion] = [
    # EMOTIONAL MASTERY
    QuizQuestion(
        question_id="em_1",
        label=Label.EMOTIONAL_MASTERY,
        question_type=QuizQuestionType.SCENARIO,
        text="A close friend cancels plans at the last minute for the third time. How do you react?",
        options=[
            ("Blow up at them over text immediately", 10.0),
            ("Feel angry but say nothing and stew about it for days", 30.0),
            ("Feel disappointed, wait a bit, then calmly tell them how it affects you",80.0,),
            ("Acknowledge the frustration, check in on them, and set a boundary", 100.0,),
        ],
    ),
    QuizQuestion(
        question_id="em_2",
        label=Label.EMOTIONAL_MASTERY,
        question_type=QuizQuestionType.SELF_RATING,
        text="I can usually name what I'm feeling (e.g., anxious, frustrated, sad) as it happens.",
        inverted=False,
    ),
    QuizQuestion(
        question_id="em_3",
        label=Label.EMOTIONAL_MASTERY,
        question_type=QuizQuestionType.AGREE_DISAGREE,
        text="When something upsets me, I tend to bottle it up rather than deal with it.",
        inverted=True,
    ),
    QuizQuestion(
        question_id="em_4",
        label=Label.EMOTIONAL_MASTERY,
        question_type=QuizQuestionType.SELF_RATING,
        text="I recover from emotional setbacks (bad news, arguments, disappointments) within a reasonable time.",
        inverted=False,
    ),
    QuizQuestion(
        question_id="cc_1",
        label=Label.COGNITIVE_CLARITY,
        question_type=QuizQuestionType.SCENARIO,
        text="You read an article that contradicts a strong opinion you hold. What do you do?",
        options=[
            ("Dismiss it immediately — it's probably biased", 10.0),
            ("Skim it but focus on the parts you can argue against", 30.0),
            ("Read it fully but feel uncomfortable and move on", 55.0),
            ("Read it carefully and genuinely consider updating your view", 100.0),
        ],
    ),
    QuizQuestion(
        question_id="cc_2",
        label=Label.COGNITIVE_CLARITY,
        question_type=QuizQuestionType.AGREE_DISAGREE,
        text="I often replay past events in my head wishing I had done things differently, even long after they happened.",
        inverted=True,
    ),
    QuizQuestion(
        question_id="cc_3",
        label=Label.COGNITIVE_CLARITY,
        question_type=QuizQuestionType.SELF_RATING,
        text="When things go wrong, I can usually see multiple reasons why — not just one person or thing to blame.",
        inverted=False,
    ),
    QuizQuestion(
        question_id="cc_4",
        label=Label.COGNITIVE_CLARITY,
        question_type=QuizQuestionType.AGREE_DISAGREE,
        text="I tend to assume the worst-case outcome when facing uncertainty.",
        inverted=True,
    ),
    QuizQuestion(
        question_id="sr_1",
        label=Label.SOCIAL_RELATIONAL,
        question_type=QuizQuestionType.SCENARIO,
        text="A coworker takes credit for your idea in a meeting. What do you do?",
        options=[
            ("Say nothing but badmouth them to other colleagues later", 15.0),
            ("Confront them aggressively in front of everyone", 20.0),
            ("Let it go this time but feel resentful", 40.0),
            ("Speak to them privately and calmly after the meeting", 100.0),
        ],
    ),
    QuizQuestion(
        question_id="sr_2",
        label=Label.SOCIAL_RELATIONAL,
        question_type=QuizQuestionType.SELF_RATING,
        text="When someone is talking to me, I fully listen rather than planning what I'll say next.",
        inverted=False,
    ),
    QuizQuestion(
        question_id="sr_3",
        label=Label.SOCIAL_RELATIONAL,
        question_type=QuizQuestionType.AGREE_DISAGREE,
        text="I find it hard to say no to people, even when I really want to.",
        inverted=True,
    ),
    QuizQuestion(
        question_id="sr_4",
        label=Label.SOCIAL_RELATIONAL,
        question_type=QuizQuestionType.SELF_RATING,
        text="I can express my needs clearly in relationships without starting a fight.",
        inverted=False,
    ),
    QuizQuestion(
        question_id="etm_1",
        label=Label.ETHICAL_MORAL,
        question_type=QuizQuestionType.SCENARIO,
        text="You overhear a friend making a disrespectful joke about someone's race. What do you do?",
        options=[
            ("Laugh along — it's just a joke", 10.0),
            ("Stay silent but feel uncomfortable", 35.0),
            ("Change the topic to avoid conflict", 45.0),
            ("Tell them directly that it's not okay", 100.0),
        ],
    ),
    QuizQuestion(
        question_id="etm_2",
        label=Label.ETHICAL_MORAL,
        question_type=QuizQuestionType.AGREE_DISAGREE,
        text="When I make a mistake that affects someone, I own up to it rather than deflecting.",
        inverted=False,
    ),
    QuizQuestion(
        question_id="etm_3",
        label=Label.ETHICAL_MORAL,
        question_type=QuizQuestionType.SELF_RATING,
        text="I treat people the same regardless of their gender, race, religion, or background.",
        inverted=False,
    ),
    QuizQuestion(
        question_id="etm_4",
        label=Label.ETHICAL_MORAL,
        question_type=QuizQuestionType.AGREE_DISAGREE,
        text="I sometimes hold others to standards that I don't follow myself.",
        inverted=True,
    ),
    # PHYSICAL & LIFESTYLE (4 questions)
    QuizQuestion(
        question_id="pl_1",
        label=Label.PHYSICAL_LIFESTYLE,
        question_type=QuizQuestionType.SCENARIO,
        text="It's 11 PM on a work night. You have an important morning meeting but you're deep into social media scrolling. What do you do?",
        options=[
            ("Keep scrolling — you'll deal with it tomorrow", 10.0),
            (
                "Tell yourself 'five more minutes' but end up staying up another hour",
                25.0,
            ),
            ("Feel guilty, put the phone down, but take a while to fall asleep", 55.0),
            ("Set the phone to charge in another room and go to sleep", 100.0),
        ],
    ),
    QuizQuestion(
        question_id="pl_2",
        label=Label.PHYSICAL_LIFESTYLE,
        question_type=QuizQuestionType.SELF_RATING,
        text="I consistently maintain a routine that includes physical activity, proper meals, and adequate sleep.",
        inverted=False,
    ),
    QuizQuestion(
        question_id="pl_3",
        label=Label.PHYSICAL_LIFESTYLE,
        question_type=QuizQuestionType.AGREE_DISAGREE,
        text="I often put off important tasks until the pressure becomes unbearable.",
        inverted=True,
    ),
    QuizQuestion(
        question_id="pl_4",
        label=Label.PHYSICAL_LIFESTYLE,
        question_type=QuizQuestionType.SELF_RATING,
        text="I manage my money responsibly — I know what I spend and save regularly.",
        inverted=False,
    ),
    QuizQuestion(
        question_id="ig_1",
        label=Label.IDENTITY_GROWTH,
        question_type=QuizQuestionType.SCENARIO,
        text="You apply for a position you really wanted and get rejected. How do you respond?",
        options=[
            ("Feel devastated and stop trying — you're clearly not good enough", 10.0),
            ("Blame the process or the people who chose someone else", 25.0),
            (
                "Feel hurt but move on without reflecting on what you could improve",
                45.0,
            ),
            (
                "Feel disappointed, ask for feedback, and use it to improve your next attempt",
                100.0,
            ),
        ],
    ),
    QuizQuestion(
        question_id="ig_2",
        label=Label.IDENTITY_GROWTH,
        question_type=QuizQuestionType.AGREE_DISAGREE,
        text="I often feel like a fraud, even when I've earned my achievements.",
        inverted=True,
    ),
    QuizQuestion(
        question_id="ig_3",
        label=Label.IDENTITY_GROWTH,
        question_type=QuizQuestionType.SELF_RATING,
        text="I have a clear sense of what I want out of life and actively work toward it.",
        inverted=False,
    ),
    QuizQuestion(
        question_id="ig_4",
        label=Label.IDENTITY_GROWTH,
        question_type=QuizQuestionType.AGREE_DISAGREE,
        text="When things go wrong in my life, I usually feel like it's out of my control and there's nothing I can do.",
        inverted=True,
    ),
]
