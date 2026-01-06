#!/bin/bash

# Script de vérification des fichiers nécessaires pour le déploiement

echo "🔍 Vérification des fichiers nécessaires..."

ERRORS=0

# Vérifier les Dockerfiles
echo ""
echo "📦 Vérification des Dockerfiles:"
if [ -f "backend/Dockerfile" ]; then
    echo "  ✅ backend/Dockerfile"
else
    echo "  ❌ backend/Dockerfile - MANQUANT"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "frontend/Dockerfile" ]; then
    echo "  ✅ frontend/Dockerfile"
else
    echo "  ❌ frontend/Dockerfile - MANQUANT"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "frontAdmin/Dockerfile" ]; then
    echo "  ✅ frontAdmin/Dockerfile"
else
    echo "  ❌ frontAdmin/Dockerfile - MANQUANT"
    ERRORS=$((ERRORS + 1))
fi

# Vérifier docker-compose.yml
echo ""
echo "🐳 Vérification de docker-compose.yml:"
if [ -f "docker-compose.yml" ]; then
    echo "  ✅ docker-compose.yml"
else
    echo "  ❌ docker-compose.yml - MANQUANT"
    ERRORS=$((ERRORS + 1))
fi

# Vérifier le fichier .env
echo ""
echo "⚙️  Vérification du fichier .env:"
if [ -f ".env" ]; then
    echo "  ✅ .env existe"
    
    # Vérifier JWT_SECRET
    if grep -q "JWT_SECRET=" .env && ! grep -q "JWT_SECRET=your_very_secure" .env; then
        echo "  ✅ JWT_SECRET est configuré"
    else
        echo "  ⚠️  JWT_SECRET n'est pas configuré ou utilise la valeur par défaut"
    fi
    
    # Vérifier DB_PASSWORD
    if grep -q "DB_PASSWORD=" .env && ! grep -q "DB_PASSWORD=your_secure" .env; then
        echo "  ✅ DB_PASSWORD est configuré"
    else
        echo "  ⚠️  DB_PASSWORD n'est pas configuré ou utilise la valeur par défaut"
    fi
else
    echo "  ❌ .env - MANQUANT"
    echo "  💡 Créez-le avec: cp .env.production.example .env"
    ERRORS=$((ERRORS + 1))
fi

# Vérifier les scripts
echo ""
echo "📜 Vérification des scripts:"
if [ -f "scripts/deploy.sh" ]; then
    echo "  ✅ scripts/deploy.sh"
else
    echo "  ❌ scripts/deploy.sh - MANQUANT"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "scripts/migrate.sh" ]; then
    echo "  ✅ scripts/migrate.sh"
else
    echo "  ❌ scripts/migrate.sh - MANQUANT"
    ERRORS=$((ERRORS + 1))
fi

# Résumé
echo ""
if [ $ERRORS -eq 0 ]; then
    echo "✅ Tous les fichiers nécessaires sont présents!"
    exit 0
else
    echo "❌ $ERRORS fichier(s) manquant(s)"
    echo ""
    echo "📋 Fichiers à transférer depuis votre machine locale:"
    echo "   - backend/Dockerfile"
    echo "   - frontend/Dockerfile"
    echo "   - frontAdmin/Dockerfile"
    echo "   - backend/.dockerignore"
    echo "   - frontend/.dockerignore"
    echo "   - frontAdmin/.dockerignore"
    exit 1
fi

