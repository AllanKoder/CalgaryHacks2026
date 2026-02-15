<?php

namespace App\Http\Controllers;

use App\Models\UserData;
use App\Models\UserScoreHistory;
use App\Services\FastApiClient;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;

class FastApiController extends Controller
{
    public function info(FastApiClient $client)
    {
        // call predict endpoint
        try {
            $resp = $client->predict(['payload' => ['example' => true]]);
            $api = $resp->json();
        } catch (\Exception $e) {
            $api = null;
        }

        // call info endpoint
        try {
            $info = Http::get(config('fastapi.url') . '/info')->json();
        } catch (\Exception $e) {
            $info = null;
        }

        return Inertia::render('FastapiTest', [
            'api' => $api,
            'info' => $info,
        ]);
    }

    public function questionnaire(FastApiClient $client)
    {
        $questions = [];

        try {
            $resp = $client->questions();
            if ($resp->ok()) {
                $questions = $resp->json('questions') ?? $resp->json() ?? [];
            }
        } catch (\Exception $e) {
            $questions = [];
        }

        return Inertia::render('questionnaire', [
            'questions' => $questions,
        ]);
    }

    public function initQuizScores(Request $request, FastApiClient $client)
    {
        $data = $request->validate([
            'answers' => ['required', 'array'],
        ]);

        try {
            $resp = $client->initQuiz($data['answers']);
            $payload = $resp->json();

            if (! is_array($payload)) {
                return response()->json($payload, $resp->status());
            }

            if ($resp->ok()) {
                $labelScores = $payload['label_scores'] ?? $payload['labelScores'] ?? null;
                if (is_array($labelScores)) {
                    $this->persistQuizScores($request, $labelScores);
                }

                $lineChartHistory = $payload['line_chart_history'] ?? $payload['lineChartHistory'] ?? null;
                if (is_array($lineChartHistory)) {
                    $this->persistLineChartHistory($request, $lineChartHistory);
                }
            }

            return response()->json($payload, $resp->status());
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to calculate or save quiz scores.',
            ], 502);
        }
    }

    private function persistQuizScores(Request $request, array $labelScores): void
    {
        $user = $request->user();
        if (! $user) {
            return;
        }

        $normalized = [];
        foreach ($labelScores as $label => $score) {
            if (! is_string($label)) {
                continue;
            }
            $normalized[$this->normalizeLabelKey($label)] = $score;
        }

        $existing = $user->userData;
        $values = [
            'EmotionalMastery' => $this->resolveScore(
                $normalized,
                ['emotional_mastery'],
                $existing?->EmotionalMastery
            ),
            'CognitiveClarity' => $this->resolveScore(
                $normalized,
                ['cognitive_clarity'],
                $existing?->CognitiveClarity
            ),
            'SocialRelational' => $this->resolveScore(
                $normalized,
                ['social_relational'],
                $existing?->SocialRelational
            ),
            'EthicalMoral' => $this->resolveScore(
                $normalized,
                ['ethical_moral'],
                $existing?->EthicalMoral
            ),
            'PhysicalHealth' => $this->resolveScore(
                $normalized,
                ['physical_lifestyle', 'physical_health'],
                $existing?->PhysicalHealth
            ),
            'IdentityGrowth' => $this->resolveScore(
                $normalized,
                ['identity_growth'],
                $existing?->IdentityGrowth
            ),
        ];

        UserData::updateOrCreate(
            ['user_id' => $user->id],
            $values
        );
    }

    private function persistLineChartHistory(Request $request, array $history): void
    {
        $user = $request->user();
        if (! $user) {
            return;
        }

        $rows = [];
        foreach ($history as $point) {
            if (! is_array($point)) {
                continue;
            }

            $timestamp = $point['timestamp'] ?? null;
            $overall = $point['overall_score'] ?? $point['overallScore'] ?? null;
            $delta = $point['delta'] ?? null;

            if (! $timestamp || ! is_numeric($overall) || ! is_numeric($delta)) {
                continue;
            }

            $rows[] = [
                'user_id' => $user->id,
                'recorded_at' => Carbon::parse($timestamp)->utc(),
                'overall_score' => round((float) $overall, 2),
                'delta' => round((float) $delta, 2),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        if ($rows === []) {
            return;
        }

        UserScoreHistory::upsert(
            $rows,
            ['user_id', 'recorded_at'],
            ['overall_score', 'delta', 'updated_at']
        );
    }

    private function resolveScore(array $scores, array $keys, ?int $fallback): int
    {
        foreach ($keys as $key) {
            if (array_key_exists($key, $scores)) {
                return $this->coerceScore($scores[$key]);
            }
        }

        return $fallback ?? 50;
    }

    private function coerceScore(mixed $value): int
    {
        if (is_numeric($value)) {
            return (int) round((float) $value);
        }

        return 50;
    }

    private function normalizeLabelKey(string $label): string
    {
        $key = strtolower($label);
        $key = str_replace([' ', '-', '.'], '_', $key);
        $key = preg_replace('/^label_/', '', $key);
        $key = preg_replace('/_+/', '_', $key);

        return $key ?? $label;
    }
}
