# Changelog - API Generate

## Version 2.0.0 - Nouvelle Structure de Requête

### 🎯 Objectif

Simplifier l'utilisation de l'API generate en permettant de spécifier uniquement le nom du template et de la brand, plutôt que d'envoyer toutes les données directement.

### ✨ Nouvelles Fonctionnalités

#### Nouvelle Structure de Requête

- **Avant** : Envoi du HTML complet + toutes les données de la brand
- **Après** : Envoi du nom du template + nom de la brand + variables de template

#### Récupération Automatique des Données

- Le système récupère automatiquement le HTML du template depuis la base de données
- Le système récupère automatiquement les données de la brand depuis la base de données
- Génération automatique des liens Google Fonts selon les polices de la brand

### 🔧 Modifications Techniques

#### Nouveaux DTOs

- `GenerateImageDto` : Nouvelle structure de requête avec validation

#### Services Modifiés

- `GenerateService` : Ajout de `generateImageFromDatabase()` et injection des services Template/Brand
- `TemplateService` : Ajout de `findByName()`
- `BrandService` : Ajout de `findByName()`

#### Modules Modifiés

- `GenerateModule` : Ajout des dépendances TemplateModule et BrandModule

### 📝 Exemple d'Utilisation

#### Ancienne Structure

```json
{
  "html": "<html>...</html>",
  "data": {
    "Titre": "Mon titre",
    "Texte": "Mon texte",
    "brand": {
      "primaryColor": "#008080",
      "secondaryColor": "#005050"
      // ... toutes les données de la brand
    }
  },
  "width": 1024,
  "height": 1024,
  "googleFontsLinks": "https://fonts.googleapis.com/..."
}
```

#### Nouvelle Structure

```json
{
  "templateName": "Template Social Media",
  "brandName": "Ma Brand",
  "templateVariables": {
    "Titre": "Mon titre",
    "Texte": "Mon texte",
    "object": "rocket"
  },
  "width": 1024,
  "height": 1024
}
```

### 🚀 Avantages

1. **Simplicité** : Plus besoin d'envoyer tout le HTML et les données de la brand
2. **Cohérence** : Les templates et brands sont récupérés depuis la base de données
3. **Maintenabilité** : Les modifications de templates/brands sont automatiquement prises en compte
4. **Sécurité** : Les données sensibles ne transitent plus dans la requête
5. **Performance** : Réduction de la taille des requêtes

### 🔄 Migration

Pour migrer vers la nouvelle API :

1. Remplacer l'envoi du HTML par le nom du template
2. Remplacer l'envoi des données de brand par le nom de la brand
3. Déplacer les variables de template dans `templateVariables`
4. Supprimer `googleFontsLinks` (généré automatiquement)

### 📚 Documentation

- Voir `API_EXAMPLE.md` pour des exemples détaillés
- Voir `test-new-api.ts` pour un script de test
