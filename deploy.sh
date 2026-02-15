#!/bin/bash

# Deployment script for poglavlje-vlku application
# This script deploys the application using Docker Compose

echo "🚀 Starting deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Stop and remove old containers
echo "🛑 Stopping old containers..."
docker compose down

# Remove old images (optional - uncomment if you want to rebuild everything)
# echo "🗑️  Removing old images..."
# docker compose down --rmi all

# Pull latest code (if using git)
# echo "📥 Pulling latest code..."
# git pull

# Build and start containers
echo "🏗️  Building containers..."
docker compose build --no-cache

echo "▶️  Starting containers..."
docker compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to start..."
sleep 10

# Check if containers are running
if [ "$(docker ps -q -f name=poglavlje-vlku)" ]; then
    echo "✅ Deployment successful!"
    echo ""
    echo "📊 Container status:"
    docker compose ps
    echo ""
    echo "🌐 Application is running at:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:5002/api"
    echo "   Nginx: http://localhost"
    echo ""
    echo "📝 To view logs:"
    echo "   docker compose logs -f"
else
    echo "❌ Deployment failed. Check logs with: docker compose logs"
    exit 1
fi
