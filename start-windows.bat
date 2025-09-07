@echo off
echo ========================================
echo      Starting Lensify Application     
echo ========================================
echo.

REM Check if setup has been run
if not exist "backend\venv" (
    echo ERROR: Virtual environment not found
    echo Please run 'setup-windows.bat' first
    pause
    exit /b 1
)

if not exist "frontend\node_modules" (
    echo ERROR: Frontend dependencies not found
    echo Please run 'setup-windows.bat' first
    pause
    exit /b 1
)

echo Starting backend server...
cd backend
start "Lensify Backend" cmd /k "venv\Scripts\activate && python main.py"

echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo Starting frontend development server...
cd ..\frontend
start "Lensify Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo        Lensify Started Successfully!   
echo ========================================
echo.
echo The application is starting up:
echo - Backend API: http://localhost:8000
echo - Frontend: http://localhost:5173
echo.
echo Both servers are running in separate command windows.
echo Close those windows to stop the application.
echo.
echo Press any key to open the application in your browser...
pause >nul

start http://localhost:5173
