<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserData;
use App\Models\UserScoreHistory;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Test User',
            'email' => 'test@test.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
            'is_first_time' => true,
            'is_therapist' => false,
        ]);

        $therapist = User::create([
            'name' => 'Real Therapist',
            'email' => 'therapist@test.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
            'onboarding_completed_at' => now(),
            'is_first_time' => false,
            'is_therapist' => true,
        ]);

        if ($therapist) {
            UserData::updateOrCreate(
                ['user_id' => $therapist->id],
                [
                    'EmotionalMastery' => 63,
                    'CognitiveClarity' => 58,
                    'SocialRelational' => 71,
                    'EthicalMoral' => 67,
                    'PhysicalHealth' => 54,
                    'IdentityGrowth' => 60,
                ]
            );

            $values = [
                52, 53, 54, 55, 54, 56, 57, 58,
                59, 58, 60, 61, 62, 60, 63, 64,
                65, 63, 66, 68, 67, 69, 71, 70,
            ];
            $rows = [];
            $intervalDays = 3;
            $start = Carbon::now('UTC')
                ->subDays((count($values) - 1) * $intervalDays)
                ->startOfDay();

            foreach ($values as $index => $value) {
                $recordedAt = $start->copy()->addDays($index * $intervalDays);
                $delta = $index === 0 ? 0 : $value - $values[$index - 1];

                $rows[] = [
                    'user_id' => $therapist->id,
                    'recorded_at' => $recordedAt,
                    'overall_score' => $value,
                    'delta' => $delta,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            UserScoreHistory::upsert(
                $rows,
                ['user_id', 'recorded_at'],
                ['overall_score', 'delta', 'updated_at']
            );
        }
    }
}
