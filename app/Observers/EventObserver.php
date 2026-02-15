<?php

namespace App\Observers;

use App\Models\Event;
use App\Services\VectorSearchService;
use Illuminate\Support\Facades\Log;

class EventObserver
{
    public function __construct(
        private VectorSearchService $vectorSearch
    ) {}

    /**
     * Handle the Event "created" event.
     */
    public function created(Event $event): void
    {
        // Index after creation (async job would be better for production)
        try {
            $event->load(['identification', 'learning']);
            if ($event->identification) {
                $this->vectorSearch->indexReflection($event);
            }
        } catch (\Exception $e) {
            Log::warning("Failed to index event {$event->id} on creation: " . $e->getMessage());
        }
    }

    /**
     * Handle the Event "updated" event.
     */
    public function updated(Event $event): void
    {
        // Reindex on update
        try {
            $event->load(['identification', 'learning']);
            if ($event->identification) {
                $this->vectorSearch->indexReflection($event);
            }
        } catch (\Exception $e) {
            Log::warning("Failed to reindex event {$event->id} on update: " . $e->getMessage());
        }
    }

    /**
     * Handle the Event "deleted" event.
     */
    public function deleted(Event $event): void
    {
        // Nothing to do for now
    }
}
