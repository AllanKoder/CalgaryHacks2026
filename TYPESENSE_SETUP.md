# Typesense Vector Search Setup

## Quick Start

Since Docker is not available in this WSL environment, we'll run Typesense natively:

### 1. Download and Run Typesense Server

```bash
# Download Typesense binary
curl -O https://dl.typesense.org/releases/27.1/typesense-server-27.1-linux-amd64.tar.gz
tar -xzf typesense-server-27.1-linux-amd64.tar.gz

# Run Typesense server
./typesense-server \
  --data-dir=/tmp/typesense-data \
  --api-key=revibe-dev-key \
  --enable-cors
```

Or keep it running in the background:

```bash
nohup ./typesense-server --data-dir=/tmp/typesense-data --api-key=revibe-dev-key --enable-cors > typesense.log 2>&1 &
```

### 2. Create Typesense Collection

```bash
php artisan typesense:setup
```

### 3. Index Existing Reflections

```bash
php artisan typesense:reindex
```

## Features

### AI-Powered Vector Search
- **Semantic Similarity**: Find reflections based on meaning, not just keywords
- **Google Gemini Embeddings**: Uses `text-embedding-004` model for 768-dimensional vectors
- **Auto-indexing**: New reflections are automatically indexed on creation/update
- **Similar Reflections Widget**: Shows related past reflections on event detail pages

### How It Works

1. When a reflection is created/updated, the system:
   - Combines title, description, focus, category, and learning content
   - Sends text to Google Gemini Embedding API
   - Stores 768-dim vector in Typesense

2. When viewing a reflection:
   - Generates embedding for current reflection
   - Performs vector similarity search in Typesense
   - Returns top 5 most similar past reflections
   - Displays with similarity scores and metadata

### Architecture

```
Event Created/Updated
    ↓
EventObserver
    ↓
TypesenseService::indexReflection()
    ↓
Google Gemini API (embeddings)
    ↓
Typesense (vector storage)
    ↓
Similar Reflections Component
    ↓
User sees related past experiences
```

## API Endpoints

- `GET /events/{event}/similar` - Get similar reflections for an event

## Commands

- `php artisan typesense:setup` - Create Typesense collection
- `php artisan typesense:reindex` - Reindex all reflections

## Configuration

Set in `.env`:

```env
GOOGLE_API_KEY=your_google_api_key
TYPESENSE_API_KEY=revibe-dev-key
TYPESENSE_HOST=localhost
TYPESENSE_PORT=8108
TYPESENSE_PROTOCOL=http
```

## Troubleshooting

### Typesense not running
Check if server is running:
```bash
curl http://localhost:8108/health
```

### Embeddings failing
- Verify `GOOGLE_API_KEY` is set in `.env`
- Check Laravel logs: `tail -f storage/logs/laravel.log`

### No similar reflections found
- Ensure reflections have identification data (category, subcategory)
- Run reindex: `php artisan typesense:reindex`
- Check that embedding generation is working (see logs)

## Future Enhancements

- [ ] Queue-based indexing for better performance
- [ ] Cluster analysis to find reflection patterns
- [ ] Time-series emotional trajectory mapping
- [ ] Multi-modal embeddings (text + metadata)
- [ ] RAG-based AI suggestions using similar reflections
