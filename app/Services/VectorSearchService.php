<?php

namespace App\Services;

use App\Models\Event;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class VectorSearchService
{
    private string $fastApiUrl;

    public function __construct()
    {
        $this->fastApiUrl = env('FASTAPI_URL', 'http://localhost:8001');
    }

    /**
     * Generate embedding for text using FastAPI
     */
    public function generateEmbedding(string $text): ?array
    {
        try {
            $response = Http::timeout(30)->post("{$this->fastApiUrl}/embeddings/generate", [
                'text' => $text,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return $data['embedding'] ?? null;
            }

            Log::error('FastAPI embedding failed: ' . $response->body());
            return null;
        } catch (\Exception $e) {
            Log::error('Embedding error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Index a reflection with its vector embedding
     */
    public function indexReflection(Event $event): void
    {
        try {
            // Build full text for embedding
            $fullText = $this->buildFullText($event);
            
            // Generate embedding via FastAPI
            $embedding = $this->generateEmbedding($fullText);

            if ($embedding) {
                // Store embedding in the database
                $event->embedding = $embedding;
                $event->saveQuietly(); // Don't trigger observer again
            }
        } catch (\Exception $e) {
            Log::error("Failed to index reflection {$event->id}: " . $e->getMessage());
        }
    }

    /**
     * Find similar reflections using cosine similarity
     */
    public function findSimilar(Event $event, int $limit = 5): array
    {
        try {
            $embedding = is_string($event->embedding)
                ? json_decode($event->embedding, true)
                : $event->embedding;

            // If no embedding exists, return empty array (no fulltext fallback)
            if (!$embedding) {
                return [];
            }

            // Find similar events using cosine similarity
            $similar = $this->cosineSimilaritySearch($event->user_id, $event->id, $embedding, $limit);

            return $similar;
        } catch (\Exception $e) {
            Log::error('Vector search failed: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Perform cosine similarity search in SQLite
     */
    private function cosineSimilaritySearch(int $userId, int $excludeId, array $queryEmbedding, int $limit): array
    {
        // Get all events with embeddings for this user (except current one)
        $events = Event::where('user_id', $userId)
            ->where('id', '!=', $excludeId)
            ->whereNotNull('embedding')
            ->with('identification')
            ->get();

        $results = [];

        foreach ($events as $candidateEvent) {
            $candidateEmbedding = is_string($candidateEvent->embedding)
                ? json_decode($candidateEvent->embedding, true)
                : $candidateEvent->embedding;

            if (!$candidateEmbedding) {
                continue;
            }

            // Calculate cosine similarity
            $similarity = $this->cosineSimilarity($queryEmbedding, $candidateEmbedding);

            $results[] = [
                'id' => $candidateEvent->id,
                'title' => $candidateEvent->title,
                'description' => $candidateEvent->description,
                'category' => $candidateEvent->identification->main_category ?? null,
                'similarity_score' => $similarity,
                'created_at' => $candidateEvent->created_at->timestamp,
            ];
        }

        // Sort by similarity (higher is better)
        usort($results, fn($a, $b) => $b['similarity_score'] <=> $a['similarity_score']);

        return array_slice($results, 0, $limit);
    }

    /**
     * Calculate cosine similarity between two vectors
     */
    private function cosineSimilarity(array $a, array $b): float
    {
        $dotProduct = 0.0;
        $magnitudeA = 0.0;
        $magnitudeB = 0.0;

        $count = min(count($a), count($b));

        for ($i = 0; $i < $count; $i++) {
            $dotProduct += $a[$i] * $b[$i];
            $magnitudeA += $a[$i] * $a[$i];
            $magnitudeB += $b[$i] * $b[$i];
        }

        $magnitudeA = sqrt($magnitudeA);
        $magnitudeB = sqrt($magnitudeB);

        if ($magnitudeA == 0 || $magnitudeB == 0) {
            return 0.0;
        }

        return $dotProduct / ($magnitudeA * $magnitudeB);
    }

    /**
     * Build full text representation for embedding
     */
    private function buildFullText(Event $event): string
    {
        $parts = [
            "Title: {$event->title}",
            "Description: {$event->description}",
        ];

        if ($event->focus) {
            $parts[] = "Focus: {$event->focus}";
        }

        if ($event->identification) {
            $ident = $event->identification;
            if ($ident->main_category) {
                $parts[] = "Category: {$ident->main_category}";
            }
            if ($ident->sub_category) {
                $parts[] = "Subcategory: {$ident->sub_category}";
            }
            
            if ($ident->assumptions) {
                $assumptions = is_array($ident->assumptions) ? $ident->assumptions : json_decode($ident->assumptions, true);
                if ($assumptions) {
                    $assumptionsText = is_array($assumptions) ? implode(', ', $assumptions) : $assumptions;
                    $parts[] = "Assumptions: {$assumptionsText}";
                }
            }
        }

        if ($event->learning) {
            $parts[] = "Learning: {$event->learning->action_plan}";
        }

        return implode("\n", $parts);
    }

    /**
     * Reindex all reflections
     */
    public function reindexAll(): array
    {
        $events = Event::with(['identification', 'learning'])->get();
        $indexed = 0;
        $failed = 0;

        foreach ($events as $event) {
            try {
                if ($event->identification) {
                    $this->indexReflection($event);
                    $indexed++;
                }
            } catch (\Exception $e) {
                $failed++;
                Log::error("Failed to index event {$event->id}: " . $e->getMessage());
            }
        }

        return [
            'indexed' => $indexed,
            'failed' => $failed,
            'total' => $events->count(),
        ];
    }
}
