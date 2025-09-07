#!/bin/bash

# Lensify Setup Script for macOS and Linux
echo "========================================"
echo "   Lensify Setup Script for Unix/Linux  "
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to detect OS
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "linux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    else
        echo "unknown"
    fi
}

OS=$(detect_os)
echo -e "${BLUE}Detected OS: $OS${NC}"
echo ""

# Check if Python is installed
if ! command_exists python3; then
    echo -e "${RED}ERROR: Python 3 is not installed${NC}"
    if [[ "$OS" == "macos" ]]; then
        echo -e "${YELLOW}Install Python 3 with: brew install python3${NC}"
        echo -e "${YELLOW}Or download from: https://python.org${NC}"
    elif [[ "$OS" == "linux" ]]; then
        echo -e "${YELLOW}Install Python 3 with your package manager:${NC}"
        echo -e "${YELLOW}  Ubuntu/Debian: sudo apt update && sudo apt install python3 python3-pip python3-venv${NC}"
        echo -e "${YELLOW}  CentOS/RHEL: sudo yum install python3 python3-pip${NC}"
        echo -e "${YELLOW}  Fedora: sudo dnf install python3 python3-pip${NC}"
    fi
    exit 1
fi

# Check Python version
PYTHON_VERSION=$(python3 --version 2>&1)
echo -e "${GREEN}Found Python: $PYTHON_VERSION${NC}"

# Check if Node.js is installed
if ! command_exists node; then
    echo -e "${RED}ERROR: Node.js is not installed${NC}"
    if [[ "$OS" == "macos" ]]; then
        echo -e "${YELLOW}Install Node.js with: brew install node${NC}"
        echo -e "${YELLOW}Or download from: https://nodejs.org${NC}"
    elif [[ "$OS" == "linux" ]]; then
        echo -e "${YELLOW}Install Node.js with your package manager:${NC}"
        echo -e "${YELLOW}  Ubuntu/Debian: curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && sudo apt-get install -y nodejs${NC}"
        echo -e "${YELLOW}  Or download from: https://nodejs.org${NC}"
    fi
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version 2>&1)
echo -e "${GREEN}Found Node.js: $NODE_VERSION${NC}"
echo ""

# Setup process
echo -e "${YELLOW}[1/6] Setting up Python virtual environment...${NC}"
cd backend || exit 1
python3 -m venv venv
if [ $? -ne 0 ]; then
    echo -e "${RED}ERROR: Failed to create virtual environment${NC}"
    exit 1
fi

echo -e "${YELLOW}[2/6] Activating virtual environment...${NC}"
source venv/bin/activate

echo -e "${YELLOW}[3/6] Installing Python dependencies...${NC}"
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo -e "${RED}ERROR: Failed to install Python dependencies${NC}"
    exit 1
fi

echo -e "${YELLOW}[4/6] Setting up frontend dependencies...${NC}"
cd ../frontend || exit 1
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}ERROR: Failed to install frontend dependencies${NC}"
    exit 1
fi

echo -e "${YELLOW}[5/6] Creating environment configuration...${NC}"
cd .. || exit 1
if [ ! -f "frontend/.env" ]; then
    echo "VITE_API_URL=http://localhost:8000" > frontend/.env
    echo -e "${GREEN}Created frontend/.env file${NC}"
fi

echo -e "${YELLOW}[6/6] Setup complete!${NC}"
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}         Setup Successful!             ${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${CYAN}Next steps:${NC}"
echo -e "1. Run ${YELLOW}./start-unix.sh${NC} to start the application"
echo -e "2. Or run backend and frontend separately:"
echo -e "   - Backend: ${YELLOW}cd backend && source venv/bin/activate && python main.py${NC}"
echo -e "   - Frontend: ${YELLOW}cd frontend && npm run dev${NC}"
echo ""
echo -e "${CYAN}The application will be available at:${NC}"
echo -e "- Frontend: ${YELLOW}http://localhost:5173${NC}"
echo -e "- Backend API: ${YELLOW}http://localhost:8000${NC}"
echo ""

# Make the start script executable
chmod +x start-unix.sh 2>/dev/null

echo -e "${GREEN}Setup completed successfully!${NC}"
