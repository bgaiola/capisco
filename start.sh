#!/bin/bash
# CAPPISCO — Start both servers
# Usage: ./start.sh

cd "$(dirname "$0")"

echo "🔄 Killing previous processes..."
lsof -ti:3001 2>/dev/null | xargs kill -9 2>/dev/null
lsof -ti:5173 2>/dev/null | xargs kill -9 2>/dev/null
sleep 1

echo "🚀 Starting backend..."
cd backend
nohup npx tsx src/index.ts > /tmp/cappisco-be.log 2>&1 &
BACKEND_PID=$!
cd ..

sleep 2

echo "🚀 Starting frontend..."
cd frontend
nohup npx vite --host > /tmp/cappisco-fe.log 2>&1 &
FRONTEND_PID=$!
cd ..

sleep 3

echo ""
echo "=========================================="
echo "  🇪🇸 CAPPISCO — running!"
echo "=========================================="
echo "  Backend:  http://localhost:3001  (PID $BACKEND_PID)"
echo "  Frontend: http://localhost:5173  (PID $FRONTEND_PID)"
echo "=========================================="
echo ""
cat /tmp/cappisco-be.log
echo ""
echo "To stop: kill $BACKEND_PID $FRONTEND_PID"
echo "$BACKEND_PID $FRONTEND_PID" > /tmp/cappisco-pids.txt
