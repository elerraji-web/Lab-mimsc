# Docker Setup Script for Windows (PowerShell)
# This script sets up and runs the MIMSC Lab application using Docker

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "MIMSC Lab - Docker Setup Script (Windows)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker is installed: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed. Please install Docker Desktop first." -ForegroundColor Red
    Write-Host "Visit: https://docs.docker.com/desktop/install/windows-install/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Docker Compose is installed
try {
    $composeVersion = docker-compose --version
    Write-Host "✅ Docker Compose is installed: $composeVersion" -ForegroundColor Green
} catch {
    try {
        $composeVersion = docker compose version
        Write-Host "✅ Docker Compose is installed: $composeVersion" -ForegroundColor Green
    } catch {
        Write-Host "❌ Docker Compose is not installed." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host ""

# Check if .env file exists, if not create from .env.docker
if (-not (Test-Path .env)) {
    Write-Host "📝 Creating .env file from .env.docker template..." -ForegroundColor Yellow
    Copy-Item .env.docker .env
    Write-Host "✅ .env file created. Please review and update if needed." -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
    Write-Host ""
}

# Stop any running containers
Write-Host "🛑 Stopping any running containers..." -ForegroundColor Yellow
docker-compose down 2>$null
Write-Host ""

# Build and start containers
Write-Host "🏗️  Building Docker images..." -ForegroundColor Yellow
docker-compose build --no-cache
Write-Host ""

Write-Host "🚀 Starting containers..." -ForegroundColor Yellow
docker-compose up -d
Write-Host ""

# Wait for services to be ready
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10
Write-Host ""

# Check if containers are running
$containersRunning = docker-compose ps | Select-String "Up"
if ($containersRunning) {
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host "✅ Setup completed successfully!" -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Container Status:" -ForegroundColor Cyan
    docker-compose ps
    Write-Host ""
    Write-Host "🌐 Application is running at: http://localhost:3000" -ForegroundColor Green
    Write-Host "🗄️  MongoDB is running at: localhost:27017" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Useful commands:" -ForegroundColor Cyan
    Write-Host "  - View logs: docker-compose logs -f"
    Write-Host "  - Stop containers: docker-compose down"
    Write-Host "  - Restart containers: docker-compose restart"
    Write-Host "  - View container status: docker-compose ps"
    Write-Host ""
    Write-Host "🔐 Admin Login:" -ForegroundColor Cyan
    Write-Host "  Email: admin@mimsc.ma"
    Write-Host "  Password: Admin@123456"
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Some containers failed to start. Check logs with:" -ForegroundColor Red
    Write-Host "   docker-compose logs" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Read-Host "Press Enter to exit"