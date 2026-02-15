<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Services\VectorSearchService;
use Illuminate\Http\Request;

class SimilarReflectionsController extends Controller
{
    public function index(Request $request, Event $event, VectorSearchService $vectorSearch)
    {
        // Authorization: only the owner can see similar reflections
        if ($event->user_id !== $request->user()->id) {
            abort(403);
        }

        $similar = $vectorSearch->findSimilar($event, limit: 5);

        return response()->json([
            'similar_reflections' => $similar,
        ]);
    }
}
