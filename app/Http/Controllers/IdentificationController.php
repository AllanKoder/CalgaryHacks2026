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
            'main_category' => 'nullable|string',
            'sub_category' => 'nullable|string',
            'assumptions' => 'nullable|array',
            'assumptions.what_assumptions' => 'nullable|string',
            'assumptions.ignored_information' => 'nullable|string',
            'assumptions.protected_beliefs' => 'nullable|string',
            'pattern_recognition' => 'nullable|array',
            'pattern_recognition.noticed_before' => 'nullable|string',
            'pattern_recognition.triggers' => 'nullable|string',
            'pattern_recognition.personal_or_organizational' => 'nullable|string',
            'pattern_recognition.common_thread' => 'nullable|string',
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
            'main_category' => 'nullable|string',
            'sub_category' => 'nullable|string',
            'assumptions' => 'nullable|array',
            'assumptions.what_assumptions' => 'nullable|string',
            'assumptions.ignored_information' => 'nullable|string',
            'assumptions.protected_beliefs' => 'nullable|string',
            'pattern_recognition' => 'nullable|array',
            'pattern_recognition.noticed_before' => 'nullable|string',
            'pattern_recognition.triggers' => 'nullable|string',
            'pattern_recognition.personal_or_organizational' => 'nullable|string',
            'pattern_recognition.common_thread' => 'nullable|string',
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
