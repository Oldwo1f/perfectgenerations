#!/bin/bash

# Script pour synchroniser les fichiers vers le serveur
# Usage: ./scripts/sync-to-server.sh [user@]server:/path/to/destination

set -e

SERVER=${1:-"root@185.211.4.81:/var/www/perfectgeneration/perfectgenerations"}

echo "🔄 Synchronisation des fichiers vers le serveur..."
echo "📡 Serveur: $SERVER"
echo ""

# Vérifier que rsync est installé
if ! command -v rsync &> /dev/null; then
    echo "❌ rsync n'est pas installé. Installez-le avec: sudo apt install rsync"
    exit 1
fi

# Exclure les fichiers inutiles
EXCLUDE=(
    "--exclude=node_modules"
    "--exclude=.nuxt"
    "--exclude=.output"
    "--exclude=dist"
    "--exclude=.git"
    "--exclude=.env"
    "--exclude=*.log"
    "--exclude=.DS_Store"
    "--exclude=coverage"
    "--exclude=.idea"
    "--exclude=.vscode"
)

echo "📦 Synchronisation du backend..."
rsync -avz --progress \
    "${EXCLUDE[@]}" \
    backend/ \
    "$SERVER/backend/"

echo ""
echo "📦 Synchronisation du frontend..."
rsync -avz --progress \
    "${EXCLUDE[@]}" \
    frontend/ \
    "$SERVER/frontend/"

echo ""
echo "📦 Synchronisation du frontAdmin..."
rsync -avz --progress \
    "${EXCLUDE[@]}" \
    frontAdmin/ \
    "$SERVER/frontAdmin/"

echo ""
echo "📦 Synchronisation des fichiers racine..."
rsync -avz --progress \
    --include="docker-compose.yml" \
    --include=".env.production.example" \
    --include="scripts/" \
    --include="README_DEPLOYMENT.md" \
    --exclude="*" \
    ./ \
    "$SERVER/"

echo ""
echo "✅ Synchronisation terminée!"
echo ""
echo "📋 Prochaines étapes sur le serveur:"
echo "   1. cd /var/www/perfectgeneration/perfectgenerations"
echo "   2. cp .env.production.example .env"
echo "   3. nano .env  # Configurer les variables"
echo "   4. ./scripts/deploy.sh"

