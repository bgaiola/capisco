#!/bin/bash
# CAPISCO — Start both servers
# Usage: ./start.sh

cd "$(dirname "$0")"

echo "🔄 Matando processos anteriores..."
lsof -ti:3001 2>/dev/null | xargs kill -9 2>/dev/null
lsof -ti:5173 2>/dev/null | xargs kill -9 2>/dev/null
sleep 1

echo "🚀 Iniciando backend..."
cd backend
nohup npx tsx src/index.ts > /tmp/capisco-be.log 2>&1 &
BACKEND_PID=$!
cd ..

sleep 2

echo "🚀 Iniciando frontend..."
cd frontend
nohup npx vite --host > /tmp/capisco-fe.log 2>&1 &
FRONTEND_PID=$!
cd ..

sleep 3

echo ""
echo "=========================================="
echo "  🇮🇹 CAPISCO — Tudo rodando!"
echo "=========================================="
echo "  Backend:  http://localhost:3001  (PID $BACKEND_PID)"
echo "  Frontend: http://localhost:5173  (PID $FRONTEND_PID)"
echo "=========================================="
echo ""
cat /tmp/capisco-be.log
echo ""
echo "Para parar: kill $BACKEND_PID $FRONTEND_PID"
echo "$BACKEND_PID $FRONTEND_PID" > /tmp/capisco-pids.txt
