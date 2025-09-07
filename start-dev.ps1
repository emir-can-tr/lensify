#!/usr/bin/env powershell
# Lensify Development Environment Startup Script

Write-Host "🚀 Starting Lensify Development Environment" -ForegroundColor Green
Write-Host "=" -ForegroundColor Blue

# Check if Python is available
if (!(Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Python not found. Please install Python 3.8+ first." -ForegroundColor Red
    exit 1
}

# Check if Node.js is available  
if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js/npm not found. Please install Node.js 16+ first." -ForegroundColor Red
    exit 1
}

Write-Host "📦 Setting up Backend..." -ForegroundColor Yellow

# Setup backend
Set-Location backend
if (!(Test-Path "venv")) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Cyan
    python -m venv venv
}

Write-Host "Activating virtual environment and installing dependencies..." -ForegroundColor Cyan
& "venv\Scripts\Activate.ps1"
pip install -r requirements.txt

Write-Host "🖥️  Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; venv\Scripts\Activate.ps1; python main.py"

Set-Location ..

Write-Host "🌐 Setting up Frontend..." -ForegroundColor Yellow

# Setup frontend
Set-Location frontend
Write-Host "Installing npm dependencies..." -ForegroundColor Cyan
npm install

Write-Host "🎨 Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"

Set-Location ..

Write-Host ""
Write-Host "🎉 Both servers are starting up!" -ForegroundColor Green
Write-Host "📡 Backend API: http://localhost:8000" -ForegroundColor Cyan
Write-Host "🖼️  Frontend App: http://localhost:5173 or http://localhost:5174" -ForegroundColor Cyan
Write-Host ""
Write-Host "📖 Documentation:" -ForegroundColor Yellow  
Write-Host "   • API Documentation: API.md" -ForegroundColor White
Write-Host "   • Deployment Guide: DEPLOYMENT.md" -ForegroundColor White
Write-Host "   • Test API: python test_api.py" -ForegroundColor White
Write-Host ""
Write-Host "✨ Happy coding! Press any key to continue..." -ForegroundColor Magenta
[System.Console]::ReadKey() | Out-Null
