<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Identification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IdentificationController extends Controller
{
    public function create(Event $event)
    {
        $this->authorize('update', $event);

        if ($event->identification) {
            return redirect()->route('events.show', $event)
                ->with('error', 'This event already has an identification.');
        }

        return Inertia::render('Identifications/Create', [
            'event' => $event,
        ]);
    }

    public function store(Request $request, Event $event)
    {
        $this->authorize('update', $event);

        if ($event->identification) {
            return redirect()->route('events.show', $event)
                ->with('error', 'This event already has an identification.');
        }

        $validated = $request->validate([
            'tag' => 'required|string',
        ]);

        $event->identification()->create($validated);

        return redirect()->route('events.show', $event)
            ->with('success', 'Identification added successfully.');
    }

    public function edit(Event $event)
    {
        $this->authorize('update', $event);

        if (!$event->identification) {
            return redirect()->route('events.show', $event)
                ->with('error', 'No identification to edit.');
        }

        return Inertia::render('Identifications/Edit', [
            'event' => $event,
            'identification' => $event->identification,
        ]);
    }

    public function update(Request $request, Event $event)
    {
        $this->authorize('update', $event);

        if (!$event->identification) {
            return redirect()->route('events.show', $event)
                ->with('error', 'No identification to update.');
        }

        $validated = $request->validate([
            'tag' => 'required|string',
        ]);

        $event->identification->update($validated);

        return redirect()->route('events.show', $event)
            ->with('success', 'Identification updated successfully.');
    }

    public function destroy(Event $event)
    {
        $this->authorize('update', $event);

        if ($event->identification) {
            $event->identification->delete();
        }

        return redirect()->route('events.show', $event)
            ->with('success', 'Identification removed successfully.');
    }
}
