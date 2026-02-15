<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Learnings;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LearningController extends Controller
{
    public function create(Event $event)
    {
        $this->authorize('update', $event);

        if (!$event->identification) {
            return redirect()->route('events.show', $event)
                ->with('error', 'You must add an identification before creating a learning.');
        }

        if ($event->learning) {
            return redirect()->route('events.show', $event)
                ->with('error', 'This event already has a learning entry.');
        }

        return Inertia::render('Learnings/Create', [
            'event' => $event,
        ]);
    }

    public function store(Request $request, Event $event)
    {
        $this->authorize('update', $event);

        if (!$event->identification) {
            return redirect()->route('events.show', $event)
                ->with('error', 'You must add an identification before creating a learning.');
        }

        if ($event->learning) {
            return redirect()->route('events.show', $event)
                ->with('error', 'This event already has a learning entry.');
        }

        $validated = $request->validate([
            'action_plan' => 'required|string',
            'next_time_strategy' => 'nullable|string',
            'resources' => 'nullable|string',
        ]);

        $event->learning()->create($validated);

        return redirect()->route('events.show', $event)
            ->with('success', 'Learning added successfully.');
    }

    public function edit(Event $event)
    {
        $this->authorize('update', $event);

        if (!$event->learning) {
            return redirect()->route('events.show', $event)
                ->with('error', 'No learning to edit.');
        }

        return Inertia::render('Learnings/Edit', [
            'event' => $event,
            'learning' => $event->learning,
        ]);
    }

    public function update(Request $request, Event $event)
    {
        $this->authorize('update', $event);

        if (!$event->learning) {
            return redirect()->route('events.show', $event)
                ->with('error', 'No learning to update.');
        }

        $validated = $request->validate([
            'action_plan' => 'required|string',
            'next_time_strategy' => 'nullable|string',
            'resources' => 'nullable|string',
        ]);

        $event->learning->update($validated);

        return redirect()->route('events.show', $event)
            ->with('success', 'Learning updated successfully.');
    }

    public function destroy(Event $event)
    {
        $this->authorize('update', $event);

        if ($event->learning) {
            $event->learning->delete();
        }

        return redirect()->route('events.show', $event)
            ->with('success', 'Learning removed successfully.');
    }
}
