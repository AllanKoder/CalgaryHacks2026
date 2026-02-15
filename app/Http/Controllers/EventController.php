<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index()
    {
        $events = auth()->user()->events()
            ->with(['identification', 'learning'])
            ->latest()
            ->get();

        return Inertia::render('Events/Index', [
            'events' => $events,
        ]);
    }

    public function create()
    {
        return Inertia::render('Events/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'emotional_severity' => 'required|integer|min:1|max:5',
            'triggers' => 'nullable|string',
            'occurred_at' => 'nullable|date',
        ]);

        $event = auth()->user()->events()->create($validated);

        return redirect()->route('events.show', $event)
            ->with('success', 'Event recorded successfully.');
    }

    public function show(Event $event)
    {
        $this->authorize('view', $event);

        $event->load(['identification', 'learning']);

        return Inertia::render('Events/Show', [
            'event' => $event,
        ]);
    }

    public function edit(Event $event)
    {
        $this->authorize('update', $event);

        return Inertia::render('Events/Edit', [
            'event' => $event,
        ]);
    }

    public function update(Request $request, Event $event)
    {
        $this->authorize('update', $event);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'emotional_severity' => 'required|integer|min:1|max:5',
            'triggers' => 'nullable|string',
            'occurred_at' => 'nullable|date',
        ]);

        $event->update($validated);

        return redirect()->route('events.show', $event)
            ->with('success', 'Event updated successfully.');
    }

    public function destroy(Event $event)
    {
        $this->authorize('delete', $event);

        $event->delete();

        return redirect()->route('events.index')
            ->with('success', 'Event deleted successfully.');
    }
}
