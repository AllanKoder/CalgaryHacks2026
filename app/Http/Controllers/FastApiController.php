<?php

namespace App\Http\Controllers;

use App\Services\FastApiClient;
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
            return response()->json($resp->json(), $resp->status());
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to calculate quiz scores.',
            ], 502);
        }
    }
}
