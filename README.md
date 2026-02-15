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
- AI-Powered Vector Search - Find similar past reflections using semantic embeddings
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

Add your Google API key to `.env`:
```env
GOOGLE_API_KEY=your_google_api_key_here
FASTAPI_URL=http://localhost:8001
```

### 3. Setup Database
```bash
touch database/database.sqlite
php artisan migrate --seed
```

### 4. Start Development Servers
```bash
# Terminal 1: Laravel
php artisan serve

# Terminal 2: Vite  
npm run dev

# Terminal 3: FastAPI (for AI features & embeddings)
cd fastapi && uvicorn main:app --reload --port 8001
```

### 5. Visit Application
- App: http://localhost:8000
- Test User: `test@test.com` / `password123`

## Vector Search

ReVibe uses **Google Gemini embeddings** via FastAPI to find semantically similar reflections.

### How It Works
1. When you create a reflection, it's sent to FastAPI
2. FastAPI generates a 768-dimensional embedding using Google Gemini
3. The embedding is stored in SQLite alongside your reflection
4. When viewing a reflection, we calculate cosine similarity with all your other reflections
5. The most similar reflections are displayed to help you find patterns

### Commands
```bash
php artisan vector:reindex  # Reindex all reflections (requires FastAPI running)
```

### Architecture
- **Embeddings**: Generated via FastAPI + Google Gemini (`text-embedding-004`)
- **Storage**: JSON column in SQLite
- **Search**: PHP cosine similarity calculation
- **Simple & Self-Contained**: No Typesense, no separate vector DB

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

