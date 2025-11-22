#!/bin/bash

# Docker Setup Script for Linux/macOS
# This script sets up and runs the MIMSC Lab application using Docker

set -e

echo "=========================================="
echo "MIMSC Lab - Docker Setup Script"
echo "=========================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Check if .env file exists, if not create from .env.docker
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.docker template..."
    cp .env.docker .env
    echo "✅ .env file created. Please review and update if needed."
    echo ""
else
    echo "✅ .env file already exists"
    echo ""
fi

# Stop any running containers
echo "🛑 Stopping any running containers..."
docker-compose down 2>/dev/null || true
echo ""

# Build and start containers
echo "🏗️  Building Docker images..."
docker-compose build --no-cache
echo ""

echo "🚀 Starting containers..."
docker-compose up -d
echo ""

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if containers are running
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "=========================================="
    echo "✅ Setup completed successfully!"
    echo "=========================================="
    echo ""
    echo "📊 Container Status:"
    docker-compose ps
    echo ""
    echo "🌐 Application is running at: http://localhost:3000"
    echo "🗄️  MongoDB is running at: localhost:27017"
    echo ""
    echo "📝 Useful commands:"
    echo "  - View logs: docker-compose logs -f"
    echo "  - Stop containers: docker-compose down"
    echo "  - Restart containers: docker-compose restart"
    echo "  - View container status: docker-compose ps"
    echo ""
    echo "🔐 Admin Login:"
    echo "  Email: admin@mimsc.ma"
    echo "  Password: Admin@123456"
    echo ""
else
    echo ""
    echo "❌ Some containers failed to start. Check logs with:"
    echo "   docker-compose logs"
    exit 1
fi