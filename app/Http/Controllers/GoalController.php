<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Goal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GoalController extends Controller
{
    public function create(Event $event)
    {
        $this->authorize('update', $event);

        if ($event->goal) {
            return redirect()->route('events.show', $event)
                ->with('error', 'This event already has a goal.');
        }

        return Inertia::render('Goals/Create', [
            'event' => $event,
        ]);
    }

    public function store(Request $request, Event $event)
    {
        $this->authorize('update', $event);

        if ($event->goal) {
            return redirect()->route('events.show', $event)
                ->with('error', 'This event already has a goal.');
        }

        $validated = $request->validate([
            'main_category' => 'required|string',
            'description' => 'nullable|string',
        ]);

        $event->goal()->create($validated);

        return redirect()->route('events.show', $event)
            ->with('success', 'Goal added successfully.');
    }

    public function edit(Event $event)
    {
        $this->authorize('update', $event);

        if (!$event->goal) {
            return redirect()->route('events.show', $event)
                ->with('error', 'No goal to edit.');
        }

        return Inertia::render('Goals/Edit', [
            'event' => $event,
            'goal' => $event->goal,
        ]);
    }

    public function update(Request $request, Event $event)
    {
        $this->authorize('update', $event);

        if (!$event->goal) {
            return redirect()->route('events.show', $event)
                ->with('error', 'No goal to update.');
        }

        $validated = $request->validate([
            'main_category' => 'required|string',
            'description' => 'nullable|string',
        ]);

        $event->goal->update($validated);

        return redirect()->route('events.show', $event)
            ->with('success', 'Goal updated successfully.');
    }

    public function destroy(Event $event)
    {
        $this->authorize('update', $event);

        if ($event->goal) {
            $event->goal->delete();
        }

        return redirect()->route('events.show', $event)
            ->with('success', 'Goal removed successfully.');
    }
}
