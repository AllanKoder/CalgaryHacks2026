<?php

namespace Database\Seeders;

use App\Models\User;
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

        User::create([
            'name' => 'Real Therapist',
            'email' => 'therapist@test.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
            'onboarding_completed_at' => now(),
            'is_first_time' => false,
            'is_therapist' => true,
        ]);
    }
}
