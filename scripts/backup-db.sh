#!/bin/bash

# Script de backup de la base de données
# Usage: ./scripts/backup-db.sh [backup_directory]

set -e

BACKUP_DIR=${1:-./backups}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/perfectgenerations_$TIMESTAMP.sql"

# Créer le répertoire de backup s'il n'existe pas
mkdir -p "$BACKUP_DIR"

echo "💾 Sauvegarde de la base de données..."

# Vérifier que le conteneur postgres est en cours d'exécution
if ! docker compose ps | grep -q "postgres.*Up"; then
    echo "❌ Le conteneur postgres n'est pas en cours d'exécution"
    exit 1
fi

# Charger les variables d'environnement
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

DB_NAME=${DB_DATABASE:-perfectgenerations}
DB_USER=${DB_USERNAME:-postgres}

# Effectuer le backup
echo "📦 Création du backup: $BACKUP_FILE"
docker compose exec -T postgres pg_dump -U "$DB_USER" "$DB_NAME" > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    # Compresser le backup
    echo "🗜️  Compression du backup..."
    gzip "$BACKUP_FILE"
    BACKUP_FILE="${BACKUP_FILE}.gz"
    
    echo "✅ Backup créé avec succès: $BACKUP_FILE"
    
    # Afficher la taille du backup
    SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "📊 Taille: $SIZE"
    
    # Supprimer les backups de plus de 30 jours
    echo "🧹 Nettoyage des anciens backups (plus de 30 jours)..."
    find "$BACKUP_DIR" -name "perfectgenerations_*.sql.gz" -mtime +30 -delete
    echo "✅ Nettoyage terminé"
else
    echo "❌ Erreur lors de la création du backup"
    exit 1
fi

