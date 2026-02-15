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
            'focus' => 'nullable|string|max:50',
            'description' => 'required|string',
            'emotional_severity' => 'required|integer|min:1|max:5',
            'triggers' => 'nullable|string',
            'occurred_at' => 'nullable|date',
            // Context fields
            'context.location' => 'nullable|string',
            'context.people_present' => 'nullable|string',
            'context.power_dynamics' => 'nullable|string',
            'context.what_happened_before' => 'nullable|string',
            'context.mental_emotional_state' => 'nullable|string',
            'context.organizational_pressures' => 'nullable|string',
            // Impact fields
            'impact.directly_affected' => 'nullable|string',
            'impact.indirectly_affected' => 'nullable|string',
            'impact.immediate_consequences' => 'nullable|string',
            'impact.longer_term_consequences' => 'nullable|string',
            'impact.impact_significance' => 'nullable|integer|min:1|max:10',
        ]);

        $event = auth()->user()->events()->create($validated);

        return redirect()->route('events.show', $event)
            ->with('success', 'Event recorded successfully.');
    }

    public function show(Event $event)
    {
        $this->authorize('view', $event);

        $event->load(['identification', 'learning']);

        $latestDiagnostic = $event->diagnosticResults()
            ->latest()
            ->first();

        return Inertia::render('Events/Show', [
            'event' => $event,
            'diagnosticResult' => $latestDiagnostic,
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
            'focus' => 'nullable|string|max:50',
            'description' => 'required|string',
            'emotional_severity' => 'required|integer|min:1|max:5',
            'triggers' => 'nullable|string',
            'occurred_at' => 'nullable|date',
            // Context fields
            'context.location' => 'nullable|string',
            'context.people_present' => 'nullable|string',
            'context.power_dynamics' => 'nullable|string',
            'context.what_happened_before' => 'nullable|string',
            'context.mental_emotional_state' => 'nullable|string',
            'context.organizational_pressures' => 'nullable|string',
            // Impact fields
            'impact.directly_affected' => 'nullable|string',
            'impact.indirectly_affected' => 'nullable|string',
            'impact.immediate_consequences' => 'nullable|string',
            'impact.longer_term_consequences' => 'nullable|string',
            'impact.impact_significance' => 'nullable|integer|min:1|max:10',
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

    public function makePublic(Event $event)
    {
        $this->authorize('update', $event);

        $event->update(['is_public' => true]);

        return back()->with('success', 'Event shared with community successfully.');
    }

    public function aiConsulting(Event $event)
    {
        $this->authorize('view', $event);

        $event->load(['learning']);

        return Inertia::render('Events/AiConsulting', [
            'event' => $event,
            'question' => 'When did your interpretation of the moment shift, and what evidence could challenge that interpretation?',
        ]);
    }

    public function aiConsultingUpdate(Request $request, Event $event)
    {
        $this->authorize('update', $event);

        $validated = $request->validate([
            'response' => 'required|string|max:4000',
        ]);

        $event->load(['learning']);

        if ($event->learning) {
            $existingResources = $event->learning->resources ? trim($event->learning->resources) : '';
            $responseBlock = "AI Consulting Response:\n" . $validated['response'];
            $resources = $existingResources ? $existingResources . "\n\n" . $responseBlock : $responseBlock;

            $event->learning->update([
                'action_plan' => $event->learning->action_plan,
                'next_time_strategy' => $event->learning->next_time_strategy,
                'resources' => $resources,
            ]);
        } else {
            $event->learning()->create([
                'action_plan' => $validated['response'],
                'next_time_strategy' => null,
                'resources' => null,
            ]);
        }

        return redirect()->route('events.show', $event)
            ->with('success', 'AI response saved to learning.');
    }

    public function community()
    {
        $events = Event::where('is_public', true)
            ->with(['identification', 'user', 'comments.user'])
            ->latest()
            ->get();

        return Inertia::render('Community', [
            'events' => $events,
        ]);
    }
}
