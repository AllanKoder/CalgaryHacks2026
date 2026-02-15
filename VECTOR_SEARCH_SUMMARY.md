# Vector Search Implementation - Simplified with SQLite

## What Changed

**Removed:** Complex Typesense server setup  
**Added:** Simple SQLite-based vector search with FastAPI embeddings

## Architecture

```
User creates reflection
    ↓
EventObserver triggered
    ↓
Send text to FastAPI (/embeddings/generate)
    ↓
FastAPI uses Google Gemini to generate 768-dim embedding
    ↓
Laravel stores embedding as JSON in SQLite
    ↓
When viewing reflection: calculate cosine similarity in PHP
    ↓
Display most similar past reflections
```

## Components

### 1. FastAPI Embedding Service (`fastapi/app/routers/embeddings.py`)
- **POST /embeddings/generate** - Single embedding
- **POST /embeddings/generate-batch** - Multiple embeddings  
- Uses Google Gemini `text-embedding-004` model
- Returns 768-dimensional vectors

### 2. Laravel Vector Search Service (`app/Services/VectorSearchService.php`)
- Calls FastAPI to generate embeddings
- Stores embeddings in SQLite JSON column
- Performs cosine similarity search in PHP
- Fallback to text search if embeddings unavailable

### 3. Database Schema
- Added `embedding` JSON column to `events` table
- Stores array of 768 floats
- No external vector database needed

### 4. Auto-Indexing
- `EventObserver` automatically generates embeddings on create/update
- Uses `saveQuietly()` to avoid infinite loops

## Setup

### 1. Install FastAPI Dependencies
```bash
cd fastapi
pip3 install langchain-core langchain-google-genai --user
```

### 2. Start FastAPI
```bash
cd fastapi
python3 -m uvicorn main:app --port 8001 --reload
```

### 3. Run Migration
```bash
php artisan migrate
```

### 4. Reindex Existing Reflections
```bash
php artisan vector:reindex
```

## Environment Variables

Add to `.env`:
```env
GOOGLE_API_KEY=your_google_api_key_here
FASTAPI_URL=http://localhost:8001
```

## Commands

- `php artisan vector:setup` - Shows setup instructions
- `php artisan vector:reindex` - Reindexes all reflections (requires FastAPI running)

## How It Works

### Embedding Generation
```php
// Laravel calls FastAPI
$response = Http::post("{$fastApiUrl}/embeddings/generate", [
    'text' => $fullText
]);
$embedding = $response->json()['embedding']; // [0.123, -0.456, ...]

// Store in database
$event->embedding = $embedding;
$event->save();
```

### Similarity Search
```php
// Calculate cosine similarity for all user's reflections
foreach ($events as $candidate) {
    $similarity = $this->cosineSimilarity(
        $queryEmbedding,
        $candidateEmbedding
    );
}

// Sort by similarity, return top 5
```

### Cosine Similarity Formula
```
similarity = (A · B) / (||A|| * ||B||)
```
where:
- A · B = dot product
- ||A|| = magnitude of vector A

## Advantages Over Typesense

✅ **Simpler**: No separate database server to run  
✅ **Self-contained**: Everything in SQLite  
✅ **Easier deployment**: No Docker/external services  
✅ **FastAPI integration**: Centralized AI logic  
✅ **Just works**: No configuration hell  

## Trade-offs

⚠️ **Performance**: PHP cosine similarity is slower than Typesense for huge datasets  
✅ **Good enough**: For personal journaling with <1000 entries, it's fine  
✅ **Can upgrade later**: If needed, migrate to pgvector or Qdrant  

## Testing

1. Create a reflection with identification
2. Embedding is auto-generated via FastAPI
3. View the reflection - see "Similar Reflections" widget
4. Widget shows reflections with matching themes/patterns

## Troubleshooting

### "Failed to fetch similar reflections"
- Check FastAPI is running on port 8001
- Check Google API key is set
- Check Laravel logs: `tail -f storage/logs/laravel.log`

### "No similar reflections found"
- Need at least 2 reflections with embeddings
- Run `php artisan vector:reindex` to generate embeddings
- Check that reflections have identification data

## Files Changed

**New:**
- `fastapi/app/routers/embeddings.py`
- `app/Services/VectorSearchService.php`
- `app/Console/Commands/VectorSetup.php`
- `app/Console/Commands/VectorReindex.php`
- `database/migrations/2026_02_15_173435_add_embedding_to_events_table.php`

**Modified:**
- `fastapi/app/services/ai_service.py` - Added embedding functions
- `app/Models/Event.php` - Added embedding cast
- `app/Observers/EventObserver.php` - Auto-indexing
- `app/Http/Controllers/SimilarReflectionsController.php` - Uses new service
- `resources/js/components/SimilarReflections.tsx` - UI (unchanged)

**Removed:**
- All Typesense files (server binary, docker-compose, scripts)
- `app/Services/TypesenseService.php`

---

**Status:** ✅ Code complete, ready to test with FastAPI running
