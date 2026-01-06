# Guide de Déploiement via GitHub

## Étape 1 : Préparer le Repository Local

### 1.1 Vérifier l'état actuel

```bash
cd /var/www/htmlToIMG/perfectgenerations
git status
```

### 1.2 Ajouter tous les fichiers nécessaires

```bash
# Ajouter les nouveaux fichiers
git add .gitignore
git add .env.production.example
git add docker-compose.yml
git add scripts/
git add GUIDE_TRANSFERT_SERVEUR.md
git add GUIDE_GITHUB.md
git add README_DEPLOYMENT.md

# Ajouter les modifications
git add docker-compose.yml
git add backend/
git add frontend/
git add frontAdmin/
```

### 1.3 Vérifier ce qui sera commité

```bash
git status
```

### 1.4 Créer un commit

```bash
git commit -m "feat: Ajout configuration Docker et scripts de déploiement

- Ajout docker-compose.yml avec PostgreSQL, Redis et services
- Ajout Dockerfiles pour backend, frontend et frontAdmin
- Ajout scripts de déploiement (deploy.sh, migrate.sh, backup-db.sh)
- Ajout .env.production.example
- Configuration Traefik pour les sous-domaines
- Corrections sécurité (CORS, JWT validation, logging, etc.)"
```

## Étape 2 : Pousser sur GitHub

### 2.1 Si vous avez déjà un remote

```bash
# Vérifier le remote actuel
git remote -v

# Pousser sur GitHub
git push origin master
# ou
git push origin main
```

### 2.2 Si vous devez créer un nouveau repository GitHub

1. **Créer un nouveau repository sur GitHub** :
   - Allez sur https://github.com/new
   - Nom : `perfectgenerations` (ou autre)
   - Ne pas initialiser avec README, .gitignore, ou licence
   - Cliquez sur "Create repository"

2. **Ajouter le remote et pousser** :
   ```bash
   # Remplacer USERNAME et REPO_NAME par vos valeurs
   git remote add origin https://github.com/USERNAME/REPO_NAME.git
   git branch -M main  # Si vous voulez utiliser 'main' au lieu de 'master'
   git push -u origin main
   ```

### 2.3 Si vous voulez changer le remote existant

```bash
# Voir le remote actuel
git remote -v

# Changer l'URL du remote
git remote set-url origin https://github.com/VOTRE_USERNAME/VOTRE_REPO.git

# Pousser
git push -u origin master
```

## Étape 3 : Cloner sur le Serveur

### 3.1 Sur le serveur, cloner le repository

```bash
# Sur le serveur
cd /var/www/perfectgeneration

# Supprimer l'ancien dossier si nécessaire (ATTENTION: sauvegardez d'abord !)
# mv perfectgenerations perfectgenerations.backup

# Cloner le repository
git clone https://github.com/VOTRE_USERNAME/VOTRE_REPO.git perfectgenerations

# Ou si vous utilisez SSH
git clone git@github.com:VOTRE_USERNAME/VOTRE_REPO.git perfectgenerations
```

### 3.2 Configurer le fichier .env

```bash
cd /var/www/perfectgeneration/perfectgenerations

# Créer le fichier .env
cp .env.production.example .env

# Éditer avec vos valeurs
nano .env
```

### 3.3 Configurer les valeurs minimales dans .env

```env
# Générer un JWT_SECRET
openssl rand -base64 32

# Mettre le résultat dans .env
JWT_SECRET=le_resultat_de_la_commande

# Configurer le mot de passe PostgreSQL
DB_PASSWORD=votre_mot_de_passe_securise
```

### 3.4 Lancer le déploiement

```bash
# Rendre les scripts exécutables
chmod +x scripts/*.sh

# Lancer le déploiement
./scripts/deploy.sh
```

## Étape 4 : Mises à Jour Futures

### 4.1 Sur votre machine locale

```bash
# Faire vos modifications
# ...

# Commit et push
git add .
git commit -m "Description des changements"
git push origin main
```

### 4.2 Sur le serveur

```bash
cd /var/www/perfectgeneration/perfectgenerations

# Récupérer les dernières modifications
git pull origin main

# Rebuild et redéployer
./scripts/deploy.sh
```

## Fichiers qui NE SERONT PAS sur GitHub

Grâce au `.gitignore`, ces fichiers ne seront **PAS** commités :
- ❌ `.env` (fichier avec vos secrets)
- ❌ `node_modules/` (sera installé dans Docker)
- ❌ `dist/`, `.nuxt/`, `.output/` (sera build dans Docker)
- ❌ `*.log` (logs)
- ❌ `backups/` (backups de base de données)

## Fichiers qui SERONT sur GitHub

- ✅ Tous les fichiers source (`src/`, `pages/`, `components/`, etc.)
- ✅ `package.json` et `package-lock.json`
- ✅ `Dockerfile` et `.dockerignore`
- ✅ `docker-compose.yml`
- ✅ `.env.production.example` (template sans secrets)
- ✅ `scripts/` (scripts de déploiement)
- ✅ Documentation

## Sécurité

⚠️ **IMPORTANT** : Ne jamais commiter :
- Le fichier `.env` (contient vos secrets)
- Les clés API
- Les mots de passe
- Les certificats SSL

Le `.gitignore` est configuré pour exclure automatiquement ces fichiers.

## Résumé des Commandes

### Sur votre machine locale :
```bash
cd /var/www/htmlToIMG/perfectgenerations
git add .
git commit -m "feat: Configuration Docker et déploiement"
git push origin main
```

### Sur le serveur :
```bash
cd /var/www/perfectgeneration
git clone https://github.com/VOTRE_USERNAME/VOTRE_REPO.git perfectgenerations
cd perfectgenerations
cp .env.production.example .env
nano .env  # Configurer
chmod +x scripts/*.sh
./scripts/deploy.sh
```

