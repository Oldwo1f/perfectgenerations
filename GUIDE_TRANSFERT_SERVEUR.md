# Guide de Transfert des Fichiers vers le Serveur

## Situation Actuelle

Vous avez tous les fichiers sur votre machine locale, mais sur le serveur il ne reste que les Dockerfiles dans `frontend/` et `frontAdmin/`.

## Solution : Transférer tous les fichiers nécessaires

### Option 1 : Utiliser le script de synchronisation (Recommandé)

**Sur votre machine locale** :

```bash
cd /var/www/htmlToIMG/perfectgenerations

# Lancer le script de synchronisation
./scripts/sync-to-server.sh
```

Ce script va :
- Transférer tous les fichiers du backend
- Transférer tous les fichiers du frontend
- Transférer tous les fichiers du frontAdmin
- Transférer docker-compose.yml, scripts, etc.
- Exclure automatiquement node_modules, .nuxt, dist, etc.

### Option 2 : Utiliser rsync manuellement

**Sur votre machine locale** :

```bash
cd /var/www/htmlToIMG/perfectgenerations

# Backend
rsync -avz --progress \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='.git' \
  --exclude='*.log' \
  backend/ \
  root@185.211.4.81:/var/www/perfectgeneration/perfectgenerations/backend/

# Frontend
rsync -avz --progress \
  --exclude='node_modules' \
  --exclude='.nuxt' \
  --exclude='.output' \
  --exclude='.git' \
  --exclude='*.log' \
  frontend/ \
  root@185.211.4.81:/var/www/perfectgeneration/perfectgenerations/frontend/

# FrontAdmin
rsync -avz --progress \
  --exclude='node_modules' \
  --exclude='.nuxt' \
  --exclude='.output' \
  --exclude='.git' \
  --exclude='*.log' \
  frontAdmin/ \
  root@185.211.4.81:/var/www/perfectgeneration/perfectgenerations/frontAdmin/

# Fichiers racine
rsync -avz --progress \
  docker-compose.yml \
  .env.production.example \
  scripts/ \
  README_DEPLOYMENT.md \
  root@185.211.4.81:/var/www/perfectgeneration/perfectgenerations/
```

### Option 3 : Utiliser scp pour les fichiers essentiels

Si rsync n'est pas disponible, vous pouvez utiliser scp :

```bash
# Depuis votre machine locale
cd /var/www/htmlToIMG/perfectgenerations

# Créer une archive
tar -czf perfectgenerations-sync.tar.gz \
  --exclude='node_modules' \
  --exclude='.nuxt' \
  --exclude='.output' \
  --exclude='dist' \
  --exclude='.git' \
  --exclude='*.log' \
  backend/ frontend/ frontAdmin/ docker-compose.yml .env.production.example scripts/ README_DEPLOYMENT.md

# Transférer l'archive
scp perfectgenerations-sync.tar.gz root@185.211.4.81:/var/www/perfectgeneration/

# Sur le serveur, extraire
ssh root@185.211.4.81 "cd /var/www/perfectgeneration/perfectgenerations && tar -xzf ../perfectgenerations-sync.tar.gz"
```

## Fichiers Critiques à Transférer

### Backend
- ✅ `src/` (tout le code source)
- ✅ `package.json` et `package-lock.json`
- ✅ `tsconfig.json`
- ✅ `Dockerfile` et `.dockerignore`
- ✅ `assets/` (icônes, etc.)
- ✅ `tools/` (scripts utilitaires)
- ❌ `node_modules/` (sera installé dans Docker)
- ❌ `dist/` (sera build dans Docker)

### Frontend
- ✅ `pages/` (toutes les pages)
- ✅ `components/` (tous les composants)
- ✅ `composables/` (composables)
- ✅ `stores/` (stores Pinia)
- ✅ `assets/` (images, fonts, etc.)
- ✅ `public/` (fichiers publics)
- ✅ `nuxt.config.ts`
- ✅ `package.json` et `package-lock.json`
- ✅ `tsconfig.json`
- ✅ `Dockerfile` et `.dockerignore`
- ❌ `node_modules/` (sera installé dans Docker)
- ❌ `.nuxt/` (sera généré dans Docker)
- ❌ `.output/` (sera build dans Docker)

### FrontAdmin
- ✅ `pages/` (toutes les pages)
- ✅ `components/` (tous les composants)
- ✅ `composables/` (composables)
- ✅ `stores/` (stores Pinia)
- ✅ `assets/` (CSS, etc.)
- ✅ `nuxt.config.ts`
- ✅ `package.json` et `package-lock.json`
- ✅ `tsconfig.json`
- ✅ `tailwind.config.js`
- ✅ `Dockerfile` et `.dockerignore`
- ❌ `node_modules/` (sera installé dans Docker)
- ❌ `.nuxt/` (sera généré dans Docker)
- ❌ `.output/` (sera build dans Docker)

## Vérification sur le Serveur

Après le transfert, sur le serveur :

```bash
cd /var/www/perfectgeneration/perfectgenerations

# Vérifier que les fichiers sont présents
ls -la frontend/package.json
ls -la frontAdmin/package.json
ls -la backend/package.json

# Vérifier la structure
ls -la frontend/pages/
ls -la frontend/components/
ls -la backend/src/

# Lancer le script de vérification
./scripts/check-files.sh
```

## Après le Transfert

1. **Créer le fichier .env** :
   ```bash
   cp .env.production.example .env
   nano .env
   ```

2. **Configurer les variables** (minimum) :
   - `DB_PASSWORD`
   - `JWT_SECRET` (générer avec `openssl rand -base64 32`)

3. **Lancer le déploiement** :
   ```bash
   ./scripts/deploy.sh
   ```

## Résumé

- ✅ **Backend** : Transférer `src/`, `package.json`, `package-lock.json`, `tsconfig.json`, `assets/`, `tools/`
- ✅ **Frontend** : Transférer `pages/`, `components/`, `composables/`, `stores/`, `assets/`, `public/`, `nuxt.config.ts`, `package.json`, `package-lock.json`
- ✅ **FrontAdmin** : Même structure que frontend
- ✅ **Racine** : `docker-compose.yml`, `.env.production.example`, `scripts/`
- ❌ **Ne PAS transférer** : `node_modules/`, `.nuxt/`, `.output/`, `dist/`

