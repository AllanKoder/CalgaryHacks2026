<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\FastApiController;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\IdentificationController;
use App\Http\Controllers\LearningController;
use App\Http\Middleware\EnsureOnboardingComplete;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified', EnsureOnboardingComplete::class])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('events', EventController::class);

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

    Route::get('community', function () {
        return Inertia::render('community');
    })->name('community');
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
