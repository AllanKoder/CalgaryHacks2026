<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureOnboardingComplete
{
    /**
     * Redirect users to the questionnaire until onboarding is complete.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return $next($request);
        }

        if ($user->onboarding_completed_at !== null) {
            return $next($request);
        }

        if ($request->routeIs('questionnaire', 'questionnaire.complete', 'questionnaire.score')) {
            return $next($request);
        }

        return redirect()->route('questionnaire');
    }
}
