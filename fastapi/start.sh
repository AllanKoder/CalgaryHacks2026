#!/bin/bash
# Start FastAPI with defaults from settings (port 8001)
uv run uvicorn main:app --host 127.0.0.1 --port 8001 --reload
