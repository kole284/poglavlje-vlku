# PowerShell deployment script for poglavlje-vlku application
# This script deploys the application using Docker Compose on Windows

Write-Host "🚀 Starting deployment..." -ForegroundColor Green

# Check if Docker is installed
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker is not installed. Please install Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Check if Docker Compose is available
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker Compose is not available. Please install Docker Desktop with Compose." -ForegroundColor Red
    exit 1
}

# Stop and remove old containers
Write-Host "🛑 Stopping old containers..." -ForegroundColor Yellow
docker compose down

# Remove old images (optional - uncomment if you want to rebuild everything)
# Write-Host "🗑️  Removing old images..." -ForegroundColor Yellow
# docker compose down --rmi all

# Pull latest code (if using git)
# Write-Host "📥 Pulling latest code..." -ForegroundColor Cyan
# git pull

# Build and start containers
Write-Host "🏗️  Building containers..." -ForegroundColor Cyan
docker compose build --no-cache

Write-Host "▶️  Starting containers..." -ForegroundColor Cyan
docker compose up -d

# Wait for services to start
Write-Host "⏳ Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check if containers are running
$containers = docker ps -q -f name=poglavlje-vlku
if ($containers) {
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Container status:" -ForegroundColor Cyan
    docker compose ps
    Write-Host ""
    Write-Host "🌐 Application is running at:" -ForegroundColor Green
    Write-Host "   Frontend: http://localhost:3000"
    Write-Host "   Backend API: http://localhost:5002/api"
    Write-Host "   Nginx: http://localhost"
    Write-Host ""
    Write-Host "📝 To view logs:" -ForegroundColor Cyan
    Write-Host "   docker compose logs -f"
} else {
    Write-Host "❌ Deployment failed. Check logs with: docker compose logs" -ForegroundColor Red
    exit 1
}
