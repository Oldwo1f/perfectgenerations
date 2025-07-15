# Script de Création d'Utilisateur Admin

Ce script permet de créer un utilisateur administrateur dans la base de données de l'application Perfect Generations.

## Utilisateur Créé

- **Email**: alexis@alexis.fr
- **Mot de passe**: Alexis09
- **Rôle**: ADMIN
- **Statut**: ACTIVE (email vérifié)

## Prérequis

1. Assurez-vous que la base de données PostgreSQL est en cours d'exécution
2. Configurez les variables d'environnement de la base de données dans un fichier `.env` à la racine du projet backend :

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=votre_mot_de_passe
DB_DATABASE=perfectgenerations
```

## Exécution du Script

### Option 1 : Utiliser le script npm (recommandé)

```bash
cd perfectgenerations/backend
npm run create-admin
```

### Option 2 : Exécution directe avec ts-node

```bash
cd perfectgenerations/backend
npx ts-node -r tsconfig-paths/register create-admin-user.ts
```

## Fonctionnalités du Script

Le script effectue les opérations suivantes :

1. **Vérification d'existence** : Vérifie si l'utilisateur existe déjà
2. **Création de l'utilisateur** : Crée un nouvel utilisateur avec le rôle ADMIN
3. **Hachage du mot de passe** : Utilise bcrypt pour sécuriser le mot de passe
4. **Création de l'abonnement** : Assigne un abonnement gratuit à l'utilisateur
5. **Initialisation du stockage** : Crée un enregistrement d'utilisation du stockage

## Gestion des Cas Particuliers

- **Utilisateur existant** : Si l'utilisateur existe déjà, le script met à jour son rôle en ADMIN
- **Plan gratuit manquant** : Si le plan gratuit n'existe pas, l'abonnement n'est pas créé (avertissement affiché)
- **Erreurs de connexion** : Le script affiche des messages d'erreur détaillés

## Messages de Sortie

Le script affiche des messages informatifs avec des emojis :

- ✅ Succès
- ⚠️ Avertissement
- ❌ Erreur
- 🔌 Fermeture de connexion

## Sécurité

- Le mot de passe est haché avec bcrypt (12 rounds)
- L'email est automatiquement marqué comme vérifié
- Le statut de l'utilisateur est défini sur ACTIVE

## Dépannage

Si vous rencontrez des erreurs :

1. Vérifiez que PostgreSQL est en cours d'exécution
2. Vérifiez les paramètres de connexion dans le fichier `.env`
3. Assurez-vous que la base de données existe
4. Vérifiez que les tables nécessaires sont créées (exécutez les migrations si nécessaire)

## Commandes Utiles

```bash
# Vérifier les migrations
npm run migration:run

# Voir les scripts disponibles
npm run

# Tester la connexion à la base de données
npm run typeorm -- query "SELECT 1"
```
