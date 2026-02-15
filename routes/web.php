<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\FastApiController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\IdentificationController;
use App\Http\Controllers\LearningController;
use App\Http\Controllers\CommentController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('events', EventController::class);
    Route::post('events/{event}/make-public', [EventController::class, 'makePublic'])->name('events.makePublic');

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
});

Route::get('community', [EventController::class, 'community'])
    ->middleware(['auth', 'verified'])
    ->name('community');

Route::get('questionnaire', [FastApiController::class, 'questionnaire'])
    ->middleware(['auth', 'verified'])
    ->name('questionnaire');

Route::get('/fastapi-test', [FastApiController::class, 'info'])->name('fastapi.test');

require __DIR__ . '/settings.php';
