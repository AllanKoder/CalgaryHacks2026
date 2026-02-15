# ReVibe - Reflective Practice Journal

**ReVibe** is a digital tool for structured reflective practice based on Terry Borton's reflective framework and experiential learning theory.

## About

ReVibe helps users transform experiences into learning through a three-step process:

1. **What?** - Document your experience
2. **So What?** - Reflect and analyze (identify patterns, assumptions, insights)
3. **Now What?** - Create actionable strategies for next time

Features:
- Personal reflection journal
- Structured analysis framework
- **AI-Powered Vector Search** - Find similar past reflections based on semantic meaning
- Community learning (share reflections with peers)
- AI-powered insights
- Track growth over time

## Quick Start

### 1. Install Dependencies
```bash
composer install
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
php artisan key:generate
```

### 3. Setup Database
```bash
touch database/database.sqlite
php artisan migrate --seed
```

### 4. Start Typesense (Vector Search)
```bash
./typesense.sh start
php artisan typesense:setup
```

### 5. Start Development Servers
```bash
# Terminal 1: Laravel
php artisan serve

# Terminal 2: Vite
npm run dev

# Terminal 3: FastAPI (optional - for AI features)
cd fastapi && uvicorn app.main:app --reload
```

### 6. Visit Application
- App: http://localhost:8000
- Test User: `test@test.com` / `password123`

## Vector Search Setup

ReVibe uses **Typesense** with **Google Gemini embeddings** to find semantically similar reflections.

### Configuration
Add to `.env`:
```env
GOOGLE_API_KEY=your_google_api_key_here
TYPESENSE_API_KEY=revibe-dev-key
TYPESENSE_HOST=localhost
TYPESENSE_PORT=8108
TYPESENSE_PROTOCOL=http
```

### Commands
```bash
./typesense.sh start          # Start Typesense server
./typesense.sh stop           # Stop Typesense server
./typesense.sh status         # Check status
php artisan typesense:setup   # Create collection
php artisan typesense:reindex # Reindex all reflections
```

See [VECTOR_SEARCH_SUMMARY.md](VECTOR_SEARCH_SUMMARY.md) for complete details.

## Development

### Quick Reset Database
```bash
php artisan migrate:refresh --seed
```

### Test User
- Email: `test@test.com`
- Password: `password123`

## Theoretical Foundation

Based on:
- Terry Borton's Reflective Practice Model (1970)
- David Kolb's Experiential Learning Cycle
- Donald Schön's Reflection-in-Action / Reflection-on-Action

