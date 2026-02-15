<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\FastApiController;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\IdentificationController;
use App\Http\Controllers\LearningController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\SimilarReflectionsController;
use App\Http\Middleware\EnsureOnboardingComplete;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified', EnsureOnboardingComplete::class])->group(function () {
    Route::get('dashboard', function (Request $request) {
        $user = $request->user();
        $userData = $user?->userData;
        $diagnosticSummary = null;
        $lineChartHistory = $user?->scoreHistory()
            ->orderBy('recorded_at')
            ->get(['recorded_at', 'overall_score', 'delta'])
            ->map(fn ($point) => [
                'timestamp' => $point->recorded_at?->toIso8601String(),
                'overall_score' => (float) $point->overall_score,
                'delta' => (float) $point->delta,
            ])
            ->values()
            ->all();
        $metricDeltas = [];

        if ($user) {
            $latestDiagnostic = $user->diagnosticResults()
                ->orderByDesc('created_at')
                ->first();

            if ($latestDiagnostic && is_array($latestDiagnostic->summary) && $latestDiagnostic->summary !== []) {
                $diagnosticSummary = [
                    'summary' => $latestDiagnostic->summary,
                    'created_at' => $latestDiagnostic->created_at?->toIso8601String(),
                ];
            }
        }

        if ($user) {
            $history = $user->labelHistory()
                ->orderByDesc('recorded_at')
                ->get(['label_key', 'score', 'recorded_at']);

            $normalizeLabelKey = function (string $label): string {
                $key = preg_replace('/([a-z])([A-Z])/', '$1_$2', $label);
                $key = strtolower($key);
                $key = str_replace([' ', '-', '.'], '_', $key);
                $key = preg_replace('/^label_/', '', $key);
                $key = preg_replace('/_+/', '_', $key);

                return $key;
            };

            $latestByLabel = [];
            $previousByLabel = [];

            foreach ($history as $row) {
                $label = $normalizeLabelKey($row->label_key);
                if (! array_key_exists($label, $latestByLabel)) {
                    $latestByLabel[$label] = (float) $row->score;
                    continue;
                }

                if (! array_key_exists($label, $previousByLabel)) {
                    $previousByLabel[$label] = (float) $row->score;
                }
            }

            $labelKeyMap = [
                'emotional_mastery' => 'emotionalMastery',
                'cognitive_clarity' => 'cognitiveClarity',
                'social_relational' => 'socialRelational',
                'ethical_moral' => 'ethicalMoral',
                'physical_lifestyle' => 'physicalLifestyle',
                'physical_health' => 'physicalLifestyle',
                'identity_growth' => 'identityGrowth',
            ];

            foreach ($latestByLabel as $label => $latestScore) {
                $previousScore = $previousByLabel[$label] ?? $latestScore;
                $mappedKey = $labelKeyMap[$label] ?? $label;
                $metricDeltas[$mappedKey] = round($latestScore - $previousScore, 1);
            }
        }

        return Inertia::render('dashboard', [
            'userData' => $userData
                ? [
                    'emotionalMastery' => $userData->EmotionalMastery,
                    'cognitiveClarity' => $userData->CognitiveClarity,
                    'socialRelational' => $userData->SocialRelational,
                    'ethicalMoral' => $userData->EthicalMoral,
                    'physicalLifestyle' => $userData->PhysicalHealth,
                    'identityGrowth' => $userData->IdentityGrowth,
                ]
                : null,
            'lineChartHistory' => $lineChartHistory,
            'metricDeltas' => $metricDeltas,
            'diagnosticSummary' => $diagnosticSummary,
        ]);
    })->name('dashboard');

    Route::resource('events', EventController::class);
    Route::post('events/{event}/make-public', [EventController::class, 'makePublic'])->name('events.makePublic');
    Route::get('events/{event}/ai-consulting', [EventController::class, 'aiConsulting'])->name('events.ai-consulting');
    Route::post('events/{event}/ai-consulting', [EventController::class, 'aiConsultingUpdate'])->name('events.ai-consulting.update');

    Route::get('events/{event}/identification/create', [IdentificationController::class, 'create'])->name('events.identification.create');
    Route::post('events/{event}/identification', [IdentificationController::class, 'store'])->name('events.identification.store');
    Route::get('events/{event}/identification/edit', [IdentificationController::class, 'edit'])->name('events.identification.edit');
    Route::put('events/{event}/identification', [IdentificationController::class, 'update'])->name('events.identification.update');
    Route::delete('events/{event}/identification', [IdentificationController::class, 'destroy'])->name('events.identification.destroy');

    Route::get('events/{event}/learning/create', [LearningController::class, 'create'])->name('events.learning.create');
    Route::post('events/{event}/learning', [LearningController::class, 'store'])->name('events.learning.store');
    Route::get('events/{event}/learning/edit', [LearningController::class, 'edit'])->name('events.learning.edit');
    Route::put('events/{event}/learning', [LearningController::class, 'update'])->name('events.learning.update');
    Route::delete('events/{event}/learning', [LearningController::class, 'destroy'])->name('events.learning.destroy');

    Route::post('comments', [CommentController::class, 'store'])->name('comments.store');
    Route::get('comments', [CommentController::class, 'index'])->name('comments.index');

    Route::get('events/{event}/similar', [SimilarReflectionsController::class, 'index'])->name('events.similar');

    Route::get('community', [EventController::class, 'community'])->name('community');

    Route::post('events/{event}/diagnostic/start', [FastApiController::class, 'diagnosticStart'])->name('diagnostic.start');
    Route::post('events/{event}/diagnostic/answer', [FastApiController::class, 'diagnosticAnswer'])->name('diagnostic.answer');
});

Route::get('questionnaire', [FastApiController::class, 'questionnaire'])
    ->middleware(['auth', 'verified'])
    ->name('questionnaire');

Route::post('questionnaire/score', [FastApiController::class, 'initQuizScores'])
    ->middleware(['auth', 'verified'])
    ->name('questionnaire.score');

Route::post('questionnaire/complete', [OnboardingController::class, 'complete'])
    ->middleware(['auth', 'verified'])
    ->name('questionnaire.complete');

Route::get('/fastapi-test', [FastApiController::class, 'info'])->name('fastapi.test');

require __DIR__ . '/settings.php';
