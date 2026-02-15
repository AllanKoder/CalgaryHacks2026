<?php

namespace App\Services;

use Typesense\Client;
use App\Models\Event;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TypesenseService
{
    private Client $client;
    private string $collectionName = 'reflections';

    public function __construct()
    {
        $this->client = new Client([
            'api_key' => env('TYPESENSE_API_KEY', 'revibe-dev-key'),
            'nodes' => [
                [
                    'host' => env('TYPESENSE_HOST', 'localhost'),
                    'port' => env('TYPESENSE_PORT', '8108'),
                    'protocol' => env('TYPESENSE_PROTOCOL', 'http'),
                ],
            ],
            'connection_timeout_seconds' => 2,
        ]);
    }

    /**
     * Create the reflections collection with vector search support
     */
    public function createCollection(): array
    {
        try {
            // Try to delete existing collection first
            try {
                $this->client->collections[$this->collectionName]->delete();
            } catch (\Exception $e) {
                // Collection doesn't exist, that's fine
            }

            $schema = [
                'name' => $this->collectionName,
                'fields' => [
                    ['name' => 'id', 'type' => 'int32'],
                    ['name' => 'user_id', 'type' => 'int32'],
                    ['name' => 'title', 'type' => 'string'],
                    ['name' => 'description', 'type' => 'string'],
                    ['name' => 'focus', 'type' => 'string', 'optional' => true],
                    ['name' => 'category', 'type' => 'string', 'optional' => true],
                    ['name' => 'subcategory', 'type' => 'string', 'optional' => true],
                    ['name' => 'emotional_severity', 'type' => 'int32'],
                    ['name' => 'created_at', 'type' => 'int64'],
                    ['name' => 'full_text', 'type' => 'string'],
                    // Vector embedding field (using OpenAI or Gemini embeddings)
                    ['name' => 'embedding', 'type' => 'float[]', 'num_dim' => 768, 'optional' => true],
                ],
                'enable_nested_fields' => true,
            ];

            return $this->client->collections->create($schema);
        } catch (\Exception $e) {
            Log::error('Typesense collection creation failed: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Generate embedding for text using Google Gemini API
     */
    public function generateEmbedding(string $text): ?array
    {
        try {
            $apiKey = env('GOOGLE_API_KEY') ?? env('GEMINI_API_KEY');
            if (!$apiKey) {
                Log::warning('No Google API key found for embeddings');
                return null;
            }

            $response = Http::post(
                "https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key={$apiKey}",
                [
                    'model' => 'models/text-embedding-004',
                    'content' => [
                        'parts' => [
                            ['text' => $text]
                        ]
                    ],
                ]
            );

            if ($response->successful()) {
                $data = $response->json();
                return $data['embedding']['values'] ?? null;
            }

            Log::error('Embedding generation failed: ' . $response->body());
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
            
            // Generate embedding
            $embedding = $this->generateEmbedding($fullText);

            $document = [
                'id' => (string)$event->id,
                'user_id' => $event->user_id,
                'title' => $event->title ?? 'Untitled',
                'description' => $event->description,
                'focus' => $event->focus ?? '',
                'category' => $event->identification->main_category ?? '',
                'subcategory' => $event->identification->sub_category ?? '',
                'emotional_severity' => $event->emotional_severity,
                'created_at' => $event->created_at->timestamp,
                'full_text' => $fullText,
            ];

            // Add embedding if generated
            if ($embedding) {
                $document['embedding'] = $embedding;
            }

            $this->client->collections[$this->collectionName]->documents->create($document);
        } catch (\Exception $e) {
            Log::error('Failed to index reflection: ' . $e->getMessage());
        }
    }

    /**
     * Find similar reflections using vector search
     */
    public function findSimilar(Event $event, int $limit = 5): array
    {
        try {
            $fullText = $this->buildFullText($event);
            $embedding = $this->generateEmbedding($fullText);

            if (!$embedding) {
                // Fallback to text search if embedding fails
                return $this->textSearch($fullText, $limit);
            }

            $searchParams = [
                'q' => '*',
                'vector_query' => 'embedding:([' . implode(',', $embedding) . '], k:' . ($limit + 1) . ')',
                'exclude_fields' => 'embedding',
                'filter_by' => 'user_id:=' . $event->user_id . ' && id:!=' . $event->id,
            ];

            $results = $this->client->collections[$this->collectionName]->documents->search($searchParams);
            
            return array_map(function ($hit) {
                return [
                    'id' => $hit['document']['id'],
                    'title' => $hit['document']['title'],
                    'description' => $hit['document']['description'],
                    'category' => $hit['document']['category'] ?? null,
                    'similarity_score' => $hit['vector_distance'] ?? 0,
                    'created_at' => $hit['document']['created_at'],
                ];
            }, $results['hits'] ?? []);
        } catch (\Exception $e) {
            Log::error('Vector search failed: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Fallback text search
     */
    private function textSearch(string $query, int $limit): array
    {
        try {
            $searchParams = [
                'q' => $query,
                'query_by' => 'title,description,full_text',
                'per_page' => $limit,
            ];

            $results = $this->client->collections[$this->collectionName]->documents->search($searchParams);
            
            return array_map(function ($hit) {
                return [
                    'id' => $hit['document']['id'],
                    'title' => $hit['document']['title'],
                    'description' => $hit['document']['description'],
                    'category' => $hit['document']['category'] ?? null,
                    'text_score' => $hit['text_match'] ?? 0,
                ];
            }, $results['hits'] ?? []);
        } catch (\Exception $e) {
            Log::error('Text search failed: ' . $e->getMessage());
            return [];
        }
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
                if ($assumptions && isset($assumptions['what_assumptions'])) {
                    $parts[] = "Assumptions: {$assumptions['what_assumptions']}";
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
                $this->indexReflection($event);
                $indexed++;
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
