<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class OnboardingController extends Controller
{
    public function complete(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user && $user->onboarding_completed_at === null) {
            $user->forceFill([
                'onboarding_completed_at' => now(),
            ])->save();
        }

        return redirect()->route('dashboard');
    }
}
