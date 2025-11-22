@echo off
REM Docker Setup Script for Windows (Command Prompt)
REM This script sets up and runs the MIMSC Lab application using Docker

echo ==========================================
echo MIMSC Lab - Docker Setup Script (Windows)
echo ==========================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed. Please install Docker Desktop first.
    echo Visit: https://docs.docker.com/desktop/install/windows-install/
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    docker compose version >nul 2>&1
    if %errorlevel% neq 0 (
        echo [ERROR] Docker Compose is not installed.
        pause
        exit /b 1
    )
)

echo [OK] Docker and Docker Compose are installed
echo.

REM Check if .env file exists, if not create from .env.docker
if not exist .env (
    echo [INFO] Creating .env file from .env.docker template...
    copy .env.docker .env >nul
    echo [OK] .env file created. Please review and update if needed.
    echo.
) else (
    echo [OK] .env file already exists
    echo.
)

REM Stop any running containers
echo [INFO] Stopping any running containers...
docker-compose down 2>nul
echo.

REM Build and start containers
echo [INFO] Building Docker images...
docker-compose build --no-cache
echo.

echo [INFO] Starting containers...
docker-compose up -d
echo.

REM Wait for services to be ready
echo [INFO] Waiting for services to be ready...
timeout /t 10 /nobreak >nul
echo.

REM Check if containers are running
docker-compose ps | findstr "Up" >nul
if %errorlevel% equ 0 (
    echo ==========================================
    echo [SUCCESS] Setup completed successfully!
    echo ==========================================
    echo.
    echo [INFO] Container Status:
    docker-compose ps
    echo.
    echo [INFO] Application is running at: http://localhost:3000
    echo [INFO] MongoDB is running at: localhost:27017
    echo.
    echo [INFO] Useful commands:
    echo   - View logs: docker-compose logs -f
    echo   - Stop containers: docker-compose down
    echo   - Restart containers: docker-compose restart
    echo   - View container status: docker-compose ps
    echo.
    echo [INFO] Admin Login:
    echo   Email: admin@mimsc.ma
    echo   Password: Admin@123456
    echo.
) else (
    echo.
    echo [ERROR] Some containers failed to start. Check logs with:
    echo   docker-compose logs
    pause
    exit /b 1
)

pause