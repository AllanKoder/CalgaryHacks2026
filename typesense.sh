#!/bin/bash

# ReVibe Typesense Server Manager

case "$1" in
  start)
    echo "🚀 Starting Typesense server..."
    mkdir -p /tmp/typesense-data
    cd "$(dirname "$0")"
    nohup ./typesense-server \
      --data-dir=/tmp/typesense-data \
      --api-key=revibe-dev-key \
      --enable-cors > typesense.log 2>&1 &
    sleep 2
    if curl -s http://localhost:8108/health > /dev/null; then
      echo "✅ Typesense is running on http://localhost:8108"
    else
      echo "❌ Failed to start Typesense. Check typesense.log"
      exit 1
    fi
    ;;
    
  stop)
    echo "🛑 Stopping Typesense server..."
    pkill -f typesense-server
    echo "✅ Typesense stopped"
    ;;
    
  status)
    if curl -s http://localhost:8108/health > /dev/null; then
      echo "✅ Typesense is running"
      echo ""
      echo "Stats:"
      curl -s http://localhost:8108/stats
    else
      echo "❌ Typesense is not running"
      exit 1
    fi
    ;;
    
  restart)
    $0 stop
    sleep 1
    $0 start
    ;;
    
  *)
    echo "ReVibe Typesense Server Manager"
    echo ""
    echo "Usage: $0 {start|stop|status|restart}"
    echo ""
    echo "Commands:"
    echo "  start   - Start Typesense server in background"
    echo "  stop    - Stop Typesense server"
    echo "  status  - Check if Typesense is running"
    echo "  restart - Restart Typesense server"
    exit 1
    ;;
esac
