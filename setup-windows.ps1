#!/usr/bin/env powershell

# Lensify Setup Script for Windows (PowerShell)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Lensify Setup Script for Windows   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a command exists
function Test-Command($cmdname) {
    try {
        Get-Command $cmdname -ErrorAction Stop
        return $true
    }
    catch {
        return $false
    }
}

# Check if Python is installed
if (-not (Test-Command "python")) {
    Write-Host "ERROR: Python is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Python 3.8+ from https://python.org" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check Python version
$pythonVersion = python --version 2>&1
Write-Host "Found Python: $pythonVersion" -ForegroundColor Green

# Check if Node.js is installed
if (-not (Test-Command "node")) {
    Write-Host "ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check Node.js version
$nodeVersion = node --version 2>&1
Write-Host "Found Node.js: $nodeVersion" -ForegroundColor Green
Write-Host ""

try {
    Write-Host "[1/6] Setting up Python virtual environment..." -ForegroundColor Yellow
    Set-Location backend
    python -m venv venv
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to create virtual environment"
    }

    Write-Host "[2/6] Activating virtual environment..." -ForegroundColor Yellow
    & "venv\Scripts\Activate.ps1"

    Write-Host "[3/6] Installing Python dependencies..." -ForegroundColor Yellow
    pip install -r requirements.txt
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to install Python dependencies"
    }

    Write-Host "[4/6] Setting up frontend dependencies..." -ForegroundColor Yellow
    Set-Location ..\frontend
    npm install
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to install frontend dependencies"
    }

    Write-Host "[5/6] Creating environment configuration..." -ForegroundColor Yellow
    Set-Location ..
    if (-not (Test-Path "frontend\.env")) {
        "VITE_API_URL=http://localhost:8000" | Out-File -FilePath "frontend\.env" -Encoding UTF8
        Write-Host "Created frontend/.env file" -ForegroundColor Green
    }

    Write-Host "[6/6] Setup complete!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "         Setup Successful!             " -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Run 'start-windows.ps1' to start the application" -ForegroundColor White
    Write-Host "2. Or run backend and frontend separately:" -ForegroundColor White
    Write-Host "   - Backend: cd backend; venv\Scripts\Activate.ps1; python main.py" -ForegroundColor Gray
    Write-Host "   - Frontend: cd frontend; npm run dev" -ForegroundColor Gray
    Write-Host ""
    Write-Host "The application will be available at:" -ForegroundColor Cyan
    Write-Host "- Frontend: http://localhost:5173" -ForegroundColor White
    Write-Host "- Backend API: http://localhost:8000" -ForegroundColor White
    Write-Host ""

} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Read-Host "Press Enter to exit"
