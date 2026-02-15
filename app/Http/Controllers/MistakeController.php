<?php

namespace App\Http\Controllers;

use App\Models\Mistake;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MistakeController extends Controller
{
    public function index()
    {
        $mistakes = auth()->user()->mistakes()
            ->with(['identification', 'learning'])
            ->latest()
            ->get();

        return Inertia::render('Mistakes/Index', [
            'mistakes' => $mistakes,
        ]);
    }

    public function create()
    {
        return Inertia::render('Mistakes/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'description' => 'required|string',
            'emotional_severity' => 'required|integer|min:1|max:10',
            'analysis' => 'nullable|string',
            'identification_tag' => 'nullable|string',
            'action_plan' => 'nullable|string',
            'next_time_strategy' => 'nullable|string',
            'resources' => 'nullable|string',
        ]);

        $mistake = auth()->user()->mistakes()->create([
            'description' => $validated['description'],
            'emotional_severity' => $validated['emotional_severity'],
            'analysis' => $validated['analysis'] ?? null,
        ]);

        if (!empty($validated['identification_tag'])) {
            $mistake->identification()->create([
                'tag' => $validated['identification_tag'],
            ]);
        }

        if (!empty($validated['action_plan'])) {
            $mistake->learning()->create([
                'action_plan' => $validated['action_plan'],
                'next_time_strategy' => $validated['next_time_strategy'] ?? null,
                'resources' => $validated['resources'] ?? null,
            ]);
        }

        return redirect()->route('mistakes.index')
            ->with('success', 'Mistake recorded successfully.');
    }

    public function show(Mistake $mistake)
    {
        $this->authorize('view', $mistake);

        $mistake->load(['identification', 'learning']);

        return Inertia::render('Mistakes/Show', [
            'mistake' => $mistake,
        ]);
    }

    public function destroy(Mistake $mistake)
    {
        $this->authorize('delete', $mistake);

        $mistake->delete();

        return redirect()->route('mistakes.index')
            ->with('success', 'Mistake deleted successfully.');
    }
}
