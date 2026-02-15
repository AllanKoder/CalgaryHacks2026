<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Event;
use App\Models\Identification;
use App\Models\Learnings;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::create([
            'name' => 'Sarah Johnson',
            'email' => 'sarah.johnson@example.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
            'onboarding_completed_at' => now(),
            'is_first_time' => false,
            'is_therapist' => false,
        ]);

        // Event 1: Work presentation anxiety
        $event1 = Event::create([
            'user_id' => $user->id,
            'title' => 'Panic Before Big Presentation',
            'focus' => 'Professional Anxiety',
            'description' => 'I had a major presentation at work today in front of senior leadership. The night before, I couldn\'t sleep and kept rehearsing in my head. This morning, I felt my heart racing, my hands were shaking, and I had trouble breathing. I seriously considered calling in sick. During the presentation, I noticed my voice was trembling and I forgot some key points I wanted to make.',
            'emotional_severity' => 4,
            'triggers' => 'Public speaking, authority figures, fear of judgment',
            'occurred_at' => now()->subDays(3),
            'context' => [
                'location' => 'Conference room at work',
                'time_of_day' => 'Morning, 9 AM',
                'people_present' => 'CEO, VP of Sales, Director of Marketing, team members',
                'duration' => '30 minutes',
            ],
            'impact' => [
                'physical' => 'Racing heart, trembling hands, shortness of breath, sweating',
                'emotional' => 'Overwhelming fear, self-doubt, embarrassment',
                'behavioral' => 'Avoided eye contact, rushed through slides, forgot key points',
                'aftermath' => 'Exhaustion, replaying mistakes, difficulty concentrating rest of day',
            ],
            'is_public' => false,
        ]);

        Identification::create([
            'event_id' => $event1->id,
            'tag' => 'Social Anxiety',
            'main_category' => 'Performance Anxiety',
            'sub_category' => 'Public Speaking Fear',
            'assumptions' => [
                'Everyone is judging me negatively',
                'I must be perfect or I will fail',
                'If I show nervousness, people will think I\'m incompetent',
                'One mistake will ruin my career',
            ],
            'pattern_recognition' => [
                'catastrophizing' => 'Assuming the worst possible outcome',
                'black_and_white_thinking' => 'Seeing the presentation as complete success or total failure',
                'mind_reading' => 'Believing I know what others are thinking about me',
            ],
        ]);

        Learnings::create([
            'event_id' => $event1->id,
            'action_plan' => 'Practice progressive muscle relaxation before presentations. Prepare thoroughly but accept that small mistakes are normal. Focus on the content rather than my performance. Use grounding techniques when anxiety rises.',
            'next_time_strategy' => 'Arrive early to get comfortable in the space. Do breathing exercises beforehand. Remember that the audience wants me to succeed. Have notes as backup. Practice with a trusted colleague first.',
            'resources' => 'Toastmasters for regular practice, cognitive behavioral therapy techniques for catastrophizing, mindfulness meditation app',
        ]);

        // Event 2: Friendship conflict and overthinking
        $event2 = Event::create([
            'user_id' => $user->id,
            'title' => 'Friend Didn\'t Reply to My Text',
            'focus' => 'Interpersonal Relationships',
            'description' => 'I texted my best friend about weekend plans and she didn\'t respond for 6 hours. I started spiraling, thinking I must have done something wrong. I went through our recent conversations looking for signs I might have offended her. I checked my phone every few minutes. When she finally replied saying she was just busy at work, I felt relieved but also embarrassed about how much mental energy I spent worrying.',
            'emotional_severity' => 3,
            'triggers' => 'Delayed responses, fear of abandonment, need for reassurance',
            'occurred_at' => now()->subDays(7),
            'context' => [
                'location' => 'At home',
                'time_of_day' => 'Throughout the day',
                'communication_medium' => 'Text message',
                'relationship_duration' => '5 years of friendship',
            ],
            'impact' => [
                'physical' => 'Tension in chest, restlessness, difficulty focusing',
                'emotional' => 'Anxiety, fear of rejection, self-blame, relief',
                'behavioral' => 'Compulsive phone checking, rumination, reviewing past conversations',
                'cognitive' => 'Difficulty concentrating on work, intrusive thoughts',
            ],
            'is_public' => false,
        ]);

        Identification::create([
            'event_id' => $event2->id,
            'tag' => 'Relationship Anxiety',
            'main_category' => 'Anxious Attachment',
            'sub_category' => 'Reassurance Seeking',
            'assumptions' => [
                'If someone doesn\'t respond quickly, they\'re upset with me',
                'I need immediate reassurance to feel secure',
                'Silence means rejection',
                'I must have done something wrong',
            ],
            'pattern_recognition' => [
                'jumping_to_conclusions' => 'Assuming negative intent without evidence',
                'emotional_reasoning' => 'My anxiety means something is actually wrong',
                'catastrophizing' => 'A delayed text means the friendship is over',
            ],
        ]);

        Learnings::create([
            'event_id' => $event2->id,
            'action_plan' => 'Practice tolerating uncertainty in relationships. Remind myself that people have busy lives and delays aren\'t personal. Set boundaries around phone checking. Build self-soothing skills instead of seeking immediate external reassurance.',
            'next_time_strategy' => 'When anxiety about a response arises, wait at least 2 hours before checking again. Engage in a distracting activity. Challenge the assumption that silence equals rejection. Journal about the anxious thoughts instead of acting on them.',
            'resources' => 'Books on anxious attachment (Attached by Levine & Heller), therapy focused on attachment patterns, meditation for emotional regulation',
        ]);

        // Event 3: Morning routine disruption and overwhelm
        $event3 = Event::create([
            'user_id' => $user->id,
            'title' => 'Spilled Coffee and Complete Derailment',
            'focus' => 'Stress Management',
            'description' => 'This morning I spilled my coffee all over my work clothes right before an important day. Instead of just changing and moving on, I completely fell apart. I started crying, felt like everything was going wrong, and ended up being 45 minutes late to work because I couldn\'t calm down. The rest of the day felt ruined even though the coffee spill was objectively minor.',
            'emotional_severity' => 5,
            'triggers' => 'Unexpected disruptions, time pressure, feeling out of control',
            'occurred_at' => now()->subDays(10),
            'context' => [
                'location' => 'Home, getting ready for work',
                'time_of_day' => 'Morning, 7:30 AM',
                'stressors' => 'Already running slightly late, important meetings scheduled',
                'sleep_quality' => 'Poor, only 5 hours',
            ],
            'impact' => [
                'physical' => 'Crying, racing thoughts, feeling overwhelmed',
                'emotional' => 'Frustration escalating to despair, hopelessness, irritability',
                'behavioral' => 'Paralysis, difficulty making decisions, late to work',
                'cognitive' => 'All-or-nothing thinking, catastrophizing the whole day',
            ],
            'is_public' => false,
        ]);

        Identification::create([
            'event_id' => $event3->id,
            'tag' => 'Emotional Dysregulation',
            'main_category' => 'Stress Response',
            'sub_category' => 'Disproportionate Reactions',
            'assumptions' => [
                'Small problems mean everything will go wrong',
                'I can\'t handle unexpected challenges',
                'The day is ruined if it doesn\'t start perfectly',
                'I should be able to handle everything smoothly',
            ],
            'pattern_recognition' => [
                'magnification' => 'Making small problems seem catastrophic',
                'all_or_nothing_thinking' => 'The day is either perfect or completely ruined',
                'should_statements' => 'Things should go according to plan',
            ],
        ]);

        Learnings::create([
            'event_id' => $event3->id,
            'action_plan' => 'Develop flexibility and resilience for unexpected disruptions. Practice self-compassion when things don\'t go as planned. Build in buffer time for morning routine. Work on emotional regulation skills for high-stress moments.',
            'next_time_strategy' => 'When something goes wrong, pause and take 5 deep breaths. Remind myself that setbacks are normal and temporary. Keep backup outfit at office. Allow extra time in morning routine. Practice reframing: "This is inconvenient but manageable."',
            'resources' => 'DBT skills for emotional regulation, self-compassion exercises (Kristin Neff), morning routine optimization, better sleep hygiene',
        ]);
    }
}
