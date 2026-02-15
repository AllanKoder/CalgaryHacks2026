"""
Complete end-to-end test demonstrating the interactive diagnostic system
"""

import asyncio
import json

from diagnostic import format_for_user_scores, start_conversation, submit_answer


async def run_complete_conversation():
    """
    Simulates a complete diagnostic conversation with sample answers.
    """
    print("=" * 80)
    print("INTERACTIVE DIAGNOSTIC CONVERSATION - COMPLETE EXAMPLE")
    print("=" * 80)
    print()

    # =========================================================================
    # STEP 1: Start the conversation
    # =========================================================================
    print("📍 STEP 1: Starting conversation...")
    print("-" * 80)

    result = await start_conversation()

    print(f"Question Type: {result['question_type']}")
    print(f"Question: {result['question']}")
    print()

    state = result["state"]

    # =========================================================================
    # STEP 2: Answer primary question
    # =========================================================================
    print("📍 STEP 2: Answering primary question...")
    print("-" * 80)

    primary_answer = (
        "I've been struggling with anxiety and procrastination for the past 6 months. "
        "I know what I need to do, but I keep putting things off until the last minute, "
        "which makes my anxiety even worse. It's affecting my work performance and my "
        "relationships. I feel like I'm constantly overwhelmed but also can't seem to start tasks."
    )

    print(f"My Answer: {primary_answer}")
    print()

    result = await submit_answer(state, primary_answer)

    if result.get("is_complete"):
        print("⚠️ Conversation completed after primary question (unexpected)")
        print(json.dumps(result["analysis"], indent=2))
        return

    print(f"Question Type: {result['question_type']}")
    print(
        f"Progress: Question {result['question_number']} of {result['total_questions']}"
    )
    print(f"Next Question: {result['question']}")
    print()

    state = result["state"]

    # =========================================================================
    # STEP 3: Answer follow-up questions
    # =========================================================================
    print("📍 STEP 3: Answering follow-up questions...")
    print("-" * 80)

    # Prepare answers for follow-up questions
    follow_up_answers = [
        # Answer 1
        (
            "When I notice myself procrastinating, I feel this intense fear that if I start "
            "and don't do it perfectly, everyone will judge me. My mind immediately goes to "
            "worst-case scenarios - like if I mess up this one thing, my whole career is over. "
            "So instead of facing it, I just distract myself with my phone, social media, or YouTube. "
            "It feels safer to not try than to try and fail."
        ),
        # Answer 2
        (
            "My partner gets really frustrated with me. I cancel plans at the last minute when "
            "I'm too anxious to go out, or I seem distant and distracted even when we're together. "
            "My friends probably think I'm unreliable - I make commitments and then back out. "
            "I don't really talk to them about what I'm going through. I just make excuses like "
            "'something came up' instead of being honest. I think they're starting to pull away."
        ),
        # Answer 3
        (
            "Honestly, my self-care is terrible right now. I stay up until 2-3 AM scrolling on "
            "my phone because I can't shut my brain off. Then I wake up exhausted, hit snooze "
            "five times, and skip breakfast. I sit at my desk all day for work, barely move. "
            "I used to go to the gym 3-4 times a week, but I haven't been in probably 4 months. "
            "I tell myself I'll start again next week, but I never do. I barely have any time "
            "for myself - it's just work, worry, and wasting time online."
        ),
        # Answer 4
        (
            "Actually yes - last week I had a big presentation at work that I was terrified about. "
            "I procrastinated preparing for it, then finally forced myself to work on it the night "
            "before. I was shaking before I presented, but it actually went really well. People "
            "said nice things afterwards and my boss was impressed. But even then, I couldn't enjoy "
            "the success. All I could think about was the one slide that I felt wasn't perfect, "
            "and how I could have done better if I'd started earlier."
        ),
    ]

    question_count = 1

    for i, answer in enumerate(follow_up_answers):
        # Check if we've run out of follow-up questions
        if result.get("is_complete"):
            print("✅ Conversation completed!")
            break

        print(f"\n--- Follow-up Question {question_count} ---")
        print(f"Q: {result['question']}")
        print(f"A: {answer}")
        print()

        result = await submit_answer(state, answer)
        state = result.get("state")
        question_count += 1

        # Stop if we have more answers than questions
        if i >= len(follow_up_answers) - 1:
            break

    # =========================================================================
    # STEP 4: Display final analysis
    # =========================================================================
    if not result.get("is_complete"):
        print("⚠️ Conversation not complete - would need more questions")
        return

    print()
    print("=" * 80)
    print("📊 FINAL ANALYSIS")
    print("=" * 80)
    print()

    analysis = result["analysis"]

    # Display scores
    print("📈 LABEL SCORES (0-100 scale)")
    print("-" * 80)
    for label, score in analysis["label_scores"].items():
        bar_length = int(score / 5)
        bar = "█" * bar_length + "░" * (20 - bar_length)
        print(f"{label:25} {score:5.1f}  {bar}")
    print()

    print(f"Overall Score: {analysis['overall_score']:.1f}")
    print()

    # Display sublabel scores
    if analysis.get("sublabel_scores"):
        print("🔍 SUBLABEL SCORES (Specific Issues Identified)")
        print("-" * 80)
        sorted_sublabels = sorted(
            analysis["sublabel_scores"].items(), key=lambda x: x[1]
        )
        for sublabel, score in sorted_sublabels[:10]:  # Show top 10
            print(f"  {sublabel:35} {score:5.1f}")
        print()

    # Display summary
    summary = analysis.get("summary", {})

    print("📝 OVERALL ASSESSMENT")
    print("-" * 80)
    print(summary.get("overall_assessment", "N/A"))
    print()

    print("💡 KEY INSIGHTS")
    print("-" * 80)
    for i, insight in enumerate(summary.get("key_insights", []), 1):
        print(f"{i}. {insight}")
    print()

    print("⚠️ PRIMARY CONCERNS")
    print("-" * 80)
    for i, concern in enumerate(summary.get("primary_concerns", []), 1):
        print(f"{i}. {concern}")
    print()

    print("✅ STRENGTHS IDENTIFIED")
    print("-" * 80)
    for i, strength in enumerate(summary.get("strengths_identified", []), 1):
        print(f"{i}. {strength}")
    print()

    print("🎯 RECOMMENDED FOCUS")
    print("-" * 80)
    print(summary.get("recommended_focus", "N/A"))
    print()

    # =========================================================================
    # STEP 5: Format for UserScores model
    # =========================================================================
    print()
    print("=" * 80)
    print("🔄 FORMATTED FOR USER SCORES MODEL")
    print("=" * 80)
    print()

    formatted = format_for_user_scores(analysis)

    print("Label Scores (Label enum format):")
    for label, score in formatted["label_scores"].items():
        print(f"  {label}: {score}")
    print()

    print("Sublabel Scores (string keys):")
    for sublabel, score in list(formatted["sublabel_scores"].items())[:5]:
        print(f"  {sublabel}: {score}")
    print(f"  ... ({len(formatted['sublabel_scores'])} total)")
    print()

    print("Line Chart History:")
    for point in formatted["line_chart_history"]:
        print(f"  {point}")
    print()

    # =========================================================================
    # STEP 6: Save to JSON file
    # =========================================================================
    print("=" * 80)
    print("💾 SAVING RESULTS")
    print("=" * 80)

    output_data = {
        "conversation_summary": {
            "total_questions": len(state["conversation_history"]),
            "questions_and_answers": state["conversation_history"],
        },
        "analysis": analysis,
        "formatted_for_model": formatted,
    }

    with open("/mnt/user-data/outputs/test_conversation_results.json", "w") as f:
        json.dump(output_data, f, indent=2)

    print("✅ Results saved to: test_conversation_results.json")
    print()

    print("=" * 80)
    print("✅ CONVERSATION COMPLETE!")
    print("=" * 80)


async def run_minimal_test():
    """
    Minimal test with just a few exchanges
    """
    print("\n\n")
    print("=" * 80)
    print("MINIMAL TEST - Quick Verification")
    print("=" * 80)
    print()

    # Start
    result = await start_conversation()
    print(f"✅ Started: {result['question'][:60]}...")

    # Answer primary
    result = await submit_answer(
        result["state"], "I struggle with work-life balance and burnout"
    )
    print(f"✅ Primary answered, got follow-up: {result['question'][:60]}...")

    # Answer 2-3 follow-ups quickly
    answers = [
        "I work 12 hour days and can't disconnect",
        "My relationships are suffering",
        "I don't exercise or sleep well",
    ]

    for ans in answers:
        result = await submit_answer(result["state"], ans)
        if result.get("is_complete"):
            print(f"✅ Complete! Overall score: {result['analysis']['overall_score']}")
            break
        print(f"✅ Answered, next: {result['question'][:60]}...")

    print()


if __name__ == "__main__":
    print("\n")
    print(
        "╔════════════════════════════════════════════════════════════════════════════╗"
    )
    print(
        "║                                                                            ║"
    )
    print(
        "║             INTERACTIVE DIAGNOSTIC CONVERSATION SYSTEM                     ║"
    )
    print(
        "║                          Complete Test Suite                               ║"
    )
    print(
        "║                                                                            ║"
    )
    print(
        "╚════════════════════════════════════════════════════════════════════════════╝"
    )
    print()

    # Run tests
    asyncio.run(run_complete_conversation())
    asyncio.run(run_minimal_test())

    print(
        "\n✨ All tests complete! Check test_conversation_results.json for full output.\n"
    )
