#!/bin/bash

# Script d'exécution des migrations
# Usage: ./scripts/migrate.sh

set -e

echo "📦 Exécution des migrations de base de données..."

# Vérifier que le conteneur backend est en cours d'exécution
if ! docker compose ps | grep -q "backend.*Up"; then
    echo "❌ Le conteneur backend n'est pas en cours d'exécution"
    exit 1
fi

# Exécuter les migrations
echo "🔄 Exécution des migrations..."
docker compose exec -T backend npm run migration:run

if [ $? -eq 0 ]; then
    echo "✅ Migrations exécutées avec succès"
else
    echo "❌ Erreur lors de l'exécution des migrations"
    exit 1
fi

