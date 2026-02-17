#!/bin/bash
# Automated nginx fix using sshpass or manual input

PASSWORD="r%Y^6L!2gZc"
SERVER="vlkuadmin@89.167.2.121"

echo "🔧 Connecting to server and fixing nginx..."
echo ""

# Try with sshpass if available, otherwise provide manual instructions
if command -v sshpass &> /dev/null; then
    echo "Using sshpass for automated login..."
    sshpass -p "$PASSWORD" ssh "$SERVER" << 'ENDSSH'
cd ~/poglavlje-vlku
echo "📊 Current status:"
docker compose ps

echo ""
echo "🛑 Stopping nginx..."
docker compose stop nginx

echo "🗑️ Removing nginx container..."
docker compose rm -f nginx

echo "🚀 Starting nginx..."
docker compose up -d nginx

echo "⏳ Waiting for startup..."
sleep 5

echo ""
echo "📊 New status:"
docker compose ps

echo ""
echo "✅ Done! Testing nginx..."
docker compose logs --tail=10 nginx
ENDSSH
else
    echo "⚠️ sshpass not found. Please run these commands manually:"
    echo ""
    echo "ssh $SERVER"
    echo "Password: $PASSWORD"
    echo ""
    echo "cd ~/poglavlje-vlku"
    echo "docker compose stop nginx"
    echo "docker compose rm -f nginx"
    echo "docker compose up -d nginx"
    echo "docker compose ps"
fi
