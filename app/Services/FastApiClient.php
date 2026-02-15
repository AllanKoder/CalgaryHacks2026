<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class FastApiClient
{
    protected $base;

    public function __construct()
    {
        $this->base = config('fastapi.url', env('FASTAPI_URL'));
    }

    public function predict(array $payload, $timeout = 5)
    {
        return Http::timeout($timeout)->post($this->base . '/predict', $payload);
    }

    public function questions($timeout = 5)
    {
        return Http::timeout($timeout)->get($this->base . '/questions');
    }

    public function initQuiz(array $answers, $timeout = 10)
    {
        return Http::timeout($timeout)->post($this->base . '/scoring/init-quiz', [
            'answers' => $answers,
        ]);
    }

    public function diagnosticStart(string $userInput, ?array $currentScores = null, ?array $eventContext = null, $timeout = 30)
    {
        $payload = ['user_input' => $userInput];
        if ($currentScores) {
            $payload['current_scores'] = $currentScores;
        }
        if ($eventContext) {
            $payload['event_context'] = $eventContext;
        }

        return Http::timeout($timeout)->post($this->base . '/diagnostic/start', $payload);
    }

    public function diagnosticAnswer(array $state, string $answer, ?array $currentScores = null, ?array $eventContext = null, $timeout = 60)
    {
        $payload = [
            'state' => $state,
            'answer' => $answer,
        ];
        if ($currentScores) {
            $payload['current_scores'] = $currentScores;
        }
        if ($eventContext) {
            $payload['event_context'] = $eventContext;
        }

        return Http::timeout($timeout)->post($this->base . '/diagnostic/answer', $payload);
    }
}
