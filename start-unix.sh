#!/bin/bash

# Lensify Start Script for macOS and Linux
echo "========================================"
echo "     Starting Lensify Application      "
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if setup has been run
if [ ! -d "backend/venv" ]; then
    echo -e "${RED}ERROR: Virtual environment not found${NC}"
    echo -e "${YELLOW}Please run './setup-unix.sh' first${NC}"
    exit 1
fi

if [ ! -d "frontend/node_modules" ]; then
    echo -e "${RED}ERROR: Frontend dependencies not found${NC}"
    echo -e "${YELLOW}Please run './setup-unix.sh' first${NC}"
    exit 1
fi

# Function to cleanup on script exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down Lensify...${NC}"
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

echo -e "${YELLOW}Starting backend server...${NC}"
cd backend || exit 1
source venv/bin/activate
python main.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

echo -e "${YELLOW}Starting frontend development server...${NC}"
cd ../frontend || exit 1
npm run dev &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 2

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}       Lensify Started Successfully!   ${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${CYAN}The application is running:${NC}"
echo -e "- Frontend: ${YELLOW}http://localhost:5173${NC}"
echo -e "- Backend API: ${YELLOW}http://localhost:8000${NC}"
echo ""
echo -e "${CYAN}Press Ctrl+C to stop the application${NC}"
echo ""

# Check if we can open the browser
if command_exists open; then
    # macOS
    echo -e "${YELLOW}Opening application in browser...${NC}"
    sleep 2
    open http://localhost:5173
elif command_exists xdg-open; then
    # Linux
    echo -e "${YELLOW}Opening application in browser...${NC}"
    sleep 2
    xdg-open http://localhost:5173 2>/dev/null
else
    echo -e "${YELLOW}Please open http://localhost:5173 in your browser${NC}"
fi

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
