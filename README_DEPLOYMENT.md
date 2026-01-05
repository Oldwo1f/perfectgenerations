# Guide de Déploiement - Perfect Generations

Ce guide vous accompagne dans le déploiement de Perfect Generations sur votre serveur VPS avec Docker et Traefik.

## Prérequis

- Serveur VPS avec Docker et Docker Compose installés
- Traefik installé et configuré avec Let's Encrypt
- Accès SSH au serveur
- Domaines configurés :
  - `perfectgeneration.aito-flow.com` (Frontend)
  - `adminperfectgeneration.aito-flow.com` (Frontend Admin)
  - `backendperfectgeneration.aito-flow.com` (Backend API)

## Architecture

```
Traefik (Reverse Proxy + SSL)
    │
    ├── perfectgeneration.aito-flow.com → Frontend (Nuxt 3)
    ├── adminperfectgeneration.aito-flow.com → Frontend Admin (Nuxt 3)
    └── backendperfectgeneration.aito-flow.com → Backend API (NestJS)
            │
            ├── PostgreSQL (Base de données)
            └── Redis (Cache + Rate Limiting)
```

## Configuration Initiale

### 1. Préparer les Variables d'Environnement

Créez un fichier `.env` à la racine du projet à partir de `.env.production.example` :

```bash
cp .env.production.example .env
```

Éditez le fichier `.env` et configurez les valeurs suivantes :

```env
# Base de Données
DB_USERNAME=postgres
DB_PASSWORD=votre_mot_de_passe_securise
DB_DATABASE=perfectgenerations

# JWT Secret (générer avec: openssl rand -base64 32)
JWT_SECRET=votre_secret_jwt_tres_long_et_securise_minimum_32_caracteres

# CORS
CORS_ORIGINS=https://perfectgeneration.aito-flow.com,https://adminperfectgeneration.aito-flow.com

# Redis (optionnel)
REDIS_PASSWORD=

# Logging
LOG_LEVEL=info
LOG_FORMAT=json
```

### 2. Configuration Traefik

Assurez-vous que Traefik est configuré pour écouter sur le réseau Docker. Le docker-compose.yml utilise le réseau `perfectgenerations-network` qui doit être accessible par Traefik.

Si Traefik utilise un réseau externe, modifiez `docker-compose.yml` :

```yaml
networks:
  perfectgenerations-network:
    external: true
    name: traefik-network  # Nom du réseau Traefik
```

## Déploiement

### Méthode 1 : Script Automatique (Recommandé)

```bash
./scripts/deploy.sh
```

Ce script :
- Vérifie les prérequis
- Génère un JWT_SECRET si nécessaire
- Build les images Docker
- Démarre tous les services
- Exécute les migrations
- Vérifie la santé des services

### Méthode 2 : Déploiement Manuel

#### Étape 1 : Build des Images

```bash
docker compose build
```

#### Étape 2 : Démarrage des Services

```bash
docker compose up -d
```

#### Étape 3 : Exécution des Migrations

```bash
./scripts/migrate.sh
```

Ou manuellement :

```bash
docker compose exec backend npm run migration:run
```

#### Étape 4 : Vérification

Vérifiez que tous les services sont démarrés :

```bash
docker compose ps
```

Vérifiez les logs :

```bash
docker compose logs -f
```

Testez le health check :

```bash
curl https://backendperfectgeneration.aito-flow.com/api/health
```

## Post-Déploiement

### Créer un Utilisateur Admin

```bash
docker compose exec backend npm run create-admin
```

Suivez les instructions pour créer votre premier utilisateur administrateur.

### Vérifier les Services

1. **Frontend** : https://perfectgeneration.aito-flow.com
2. **Admin** : https://adminperfectgeneration.aito-flow.com
3. **API Health** : https://backendperfectgeneration.aito-flow.com/api/health
4. **API Swagger** (si activé) : https://backendperfectgeneration.aito-flow.com/api

## Gestion des Services

### Voir les Logs

```bash
# Tous les services
docker compose logs -f

# Un service spécifique
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f frontadmin
```

### Arrêter les Services

```bash
docker compose down
```

### Redémarrer un Service

```bash
docker compose restart backend
```

### Rebuild et Redéployer

```bash
docker compose down
docker compose build --no-cache
docker compose up -d
./scripts/migrate.sh
```

## Sauvegarde et Restauration

### Sauvegarde de la Base de Données

```bash
./scripts/backup-db.sh
```

Les backups sont stockés dans le répertoire `./backups/` et compressés automatiquement. Les backups de plus de 30 jours sont automatiquement supprimés.

### Restauration de la Base de Données

```bash
# Décompresser le backup
gunzip backups/perfectgenerations_YYYYMMDD_HHMMSS.sql.gz

# Restaurer
docker compose exec -T postgres psql -U postgres perfectgenerations < backups/perfectgenerations_YYYYMMDD_HHMMSS.sql
```

## Maintenance

### Mises à Jour

1. Arrêter les services :
   ```bash
   docker compose down
   ```

2. Mettre à jour le code :
   ```bash
   git pull
   ```

3. Rebuild et redéployer :
   ```bash
   ./scripts/deploy.sh
   ```

### Nettoyage

Nettoyer les images Docker inutilisées :

```bash
docker system prune -a
```

## Dépannage

### Les services ne démarrent pas

1. Vérifiez les logs :
   ```bash
   docker compose logs
   ```

2. Vérifiez que les ports ne sont pas déjà utilisés :
   ```bash
   netstat -tulpn | grep -E '3000|3001|3002|5432|6379'
   ```

3. Vérifiez que Traefik peut accéder au réseau :
   ```bash
   docker network inspect perfectgenerations-network
   ```

### Erreurs de Connexion à la Base de Données

1. Vérifiez que PostgreSQL est démarré :
   ```bash
   docker compose ps postgres
   ```

2. Vérifiez les variables d'environnement :
   ```bash
   docker compose exec backend env | grep DB_
   ```

3. Testez la connexion :
   ```bash
   docker compose exec postgres psql -U postgres -d perfectgenerations -c "SELECT 1;"
   ```

### Erreurs de Certificat SSL

1. Vérifiez que les domaines pointent vers votre serveur
2. Vérifiez la configuration Traefik pour Let's Encrypt
3. Vérifiez les logs Traefik :
   ```bash
   docker logs traefik
   ```

### Rate Limiting ne fonctionne pas

1. Vérifiez que Redis est démarré :
   ```bash
   docker compose ps redis
   ```

2. Testez la connexion Redis :
   ```bash
   docker compose exec redis redis-cli ping
   ```

3. Vérifiez les variables d'environnement :
   ```bash
   docker compose exec backend env | grep REDIS_
   ```

## Sécurité

### Checklist de Sécurité

- [ ] JWT_SECRET est configuré et fait au moins 32 caractères
- [ ] DB_PASSWORD est sécurisé
- [ ] REDIS_PASSWORD est configuré (recommandé)
- [ ] ENABLE_SWAGGER est à `false` en production
- [ ] CORS_ORIGINS contient uniquement vos domaines
- [ ] Les certificats SSL sont valides
- [ ] Les backups sont réguliers
- [ ] Les logs ne contiennent pas d'informations sensibles

### Variables d'Environnement Sensibles

Ne commitez **JAMAIS** le fichier `.env` dans Git. Il est déjà dans `.gitignore`.

## Monitoring

### Health Check

L'endpoint `/api/health` vérifie :
- Le statut de l'application
- La connexion à la base de données
- L'uptime du serveur

### Logs

Les logs sont structurés en JSON en production pour faciliter l'analyse. Utilisez un outil comme `jq` pour les analyser :

```bash
docker compose logs backend | jq
```

## Support

En cas de problème :

1. Consultez les logs : `docker compose logs`
2. Vérifiez le health check : `curl https://backendperfectgeneration.aito-flow.com/api/health`
3. Vérifiez la documentation dans `DEPLOYMENT_CHECKLIST.md`

## Commandes Utiles

```bash
# Voir l'état des services
docker compose ps

# Voir les logs en temps réel
docker compose logs -f

# Exécuter une commande dans un conteneur
docker compose exec backend npm run create-admin

# Accéder au shell d'un conteneur
docker compose exec backend sh

# Voir l'utilisation des ressources
docker stats

# Nettoyer les volumes inutilisés
docker volume prune
```

---

**Note** : Ce guide suppose que Traefik est déjà configuré et fonctionnel. Si ce n'est pas le cas, consultez la documentation Traefik pour la configuration initiale.

