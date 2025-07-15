#!/bin/bash

# Script de création d'utilisateur admin pour Perfect Generations
# Auteur: Assistant IA
# Date: $(date)

echo "🚀 Démarrage du script de création d'utilisateur admin..."
echo ""

# Vérifier si on est dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: Ce script doit être exécuté depuis le répertoire backend"
    echo "   Veuillez naviguer vers perfectgenerations/backend et réessayer"
    exit 1
fi

# Vérifier si les dépendances sont installées
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Vérifier si le fichier .env existe
if [ ! -f ".env" ]; then
    echo "⚠️  Avertissement: Fichier .env non trouvé"
    echo "   Le script utilisera les valeurs par défaut pour la base de données"
    echo "   Pour une configuration personnalisée, créez un fichier .env"
    echo ""
fi

# Exécuter le script de création d'admin
echo "👤 Création de l'utilisateur admin..."
echo "   Email: alexis@alexis.fr"
echo "   Mot de passe: Alexis09"
echo "   Rôle: ADMIN"
echo ""

npm run create-admin

echo ""
echo "✅ Script terminé!" 