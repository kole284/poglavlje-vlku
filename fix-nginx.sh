#!/bin/bash
# Quick fix script to restart nginx

echo "🔧 Fixing nginx configuration..."

# Stop and remove nginx container
docker compose stop nginx
docker compose rm -f nginx

# Start nginx again
docker compose up -d nginx

# Wait for startup
sleep 3

# Check status
echo "📊 Container status:"
docker compose ps

echo ""
echo "✅ Nginx restart complete!"
