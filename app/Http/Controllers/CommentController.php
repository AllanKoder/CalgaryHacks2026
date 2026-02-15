<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Event;
use App\Models\Identification;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'commentable_type' => 'required|in:event,identification',
            'commentable_id' => 'required|integer',
            'content' => 'required|string|max:1000',
        ]);

        $commentableClass = match ($validated['commentable_type']) {
            'event' => Event::class,
            'identification' => Identification::class,
        };

        $commentable = $commentableClass::findOrFail($validated['commentable_id']);

        $comment = Comment::create([
            'user_id' => auth()->id(),
            'commentable_type' => $commentableClass,
            'commentable_id' => $commentable->id,
            'content' => $validated['content'],
        ]);

        $comment->load('user');

        return back()->with('success', 'Comment added successfully.');
    }


    public function index(Request $request)
    {
        $validated = $request->validate([
            'commentable_type' => 'required|in:event,identification',
            'commentable_id' => 'required|integer',
        ]);

        $commentableClass = match ($validated['commentable_type']) {
            'event' => Event::class,
            'identification' => Identification::class,
        };

        $commentable = $commentableClass::findOrFail($validated['commentable_id']);

        $comments = $commentable->comments()
            ->with('user')
            ->latest()
            ->get();

        return response()->json($comments);
    }
}
