@echo off
echo ========================================
echo    Lensify Setup Script for Windows    
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://python.org
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo [1/6] Setting up Python virtual environment...
cd backend
python -m venv venv
if %errorlevel% neq 0 (
    echo ERROR: Failed to create virtual environment
    pause
    exit /b 1
)

echo [2/6] Activating virtual environment...
call venv\Scripts\activate.bat

echo [3/6] Installing Python dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Python dependencies
    pause
    exit /b 1
)

echo [4/6] Setting up frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo [5/6] Creating environment configuration...
cd ..
if not exist ".env" (
    echo VITE_API_URL=http://localhost:8000 > frontend\.env
    echo Created frontend/.env file
)

echo [6/6] Setup complete!
echo.
echo ========================================
echo          Setup Successful!             
echo ========================================
echo.
echo Next steps:
echo 1. Run 'start-windows.bat' to start the application
echo 2. Or run backend and frontend separately:
echo    - Backend: cd backend ^&^& venv\Scripts\activate ^&^& python main.py
echo    - Frontend: cd frontend ^&^& npm run dev
echo.
echo The application will be available at:
echo - Frontend: http://localhost:5173
echo - Backend API: http://localhost:8000
echo.
pause
