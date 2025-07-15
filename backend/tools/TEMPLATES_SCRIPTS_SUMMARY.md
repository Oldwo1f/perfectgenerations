# Scripts de gestion des templates - Résumé

Ce document résume tous les scripts créés pour gérer les templates en base de données.

## 📁 Fichiers créés

### 1. `add-templates.ts`

Script principal pour ajouter des templates définis directement dans le code.

**Commandes disponibles :**

- `npm run add-templates add-all` - Ajouter tous les templates définis
- `npm run add-templates list` - Lister tous les templates existants
- `npm run add-templates` - Afficher l'aide

### 2. `add-templates-from-json.ts`

Script pour ajouter des templates depuis un fichier JSON.

**Commandes disponibles :**

- `npm run add-templates-json add templates-examples.json` - Ajouter des templates depuis un fichier JSON
- `npm run add-templates-json validate templates-examples.json` - Valider un fichier JSON
- `npm run add-templates-json` - Afficher l'aide

### 3. `add-testimonial-template.ts`

Script spécifique pour ajouter le template de témoignages utilisateur.

**Commande :**

- `npm run add-testimonial` - Ajouter le template de témoignages

### 4. `templates-examples.json`

Fichier JSON contenant des exemples de templates prêts à l'emploi.

### 5. `ADD_TEMPLATES_README.md`

Documentation complète pour l'utilisation des scripts.

## 🎯 Template de témoignages utilisateur

Le template que vous avez demandé a été créé avec succès :

- **Nom :** "Témoignages utilisateur"
- **Catégorie :** "Témoignages"
- **Dimensions :** 600x1024
- **Variables :** title, text, date
- **Variables de marque :** primaryColor, textColor, titleFont, textFont, logoUrl

## ✅ Tests effectués

1. ✅ Ajout du template via le script principal
2. ✅ Validation du fichier JSON d'exemples
3. ✅ Ajout de templates depuis le fichier JSON
4. ✅ Vérification des doublons
5. ✅ Affichage des statistiques

## 📊 Résultats

- **Templates d'exemple en base :** 5
- **Catégories disponibles :** Témoignages, Citations, Promotions
- **Scripts fonctionnels :** 3
- **Documentation :** Complète

## 🚀 Utilisation rapide

Pour ajouter le template de témoignages que vous avez demandé :

```bash
cd perfectgenerations/backend
npm run add-testimonial
```

Pour ajouter plusieurs templates depuis le fichier JSON :

```bash
npm run add-templates-json add templates-examples.json
```

## 🔧 Personnalisation

Pour ajouter vos propres templates :

1. **Méthode simple :** Modifiez `add-templates.ts` et ajoutez vos templates dans le tableau `templatesToAdd`
2. **Méthode recommandée :** Créez un fichier JSON et utilisez `add-templates-from-json.ts`

## 📝 Structure des templates

Chaque template doit contenir :

- `name` : Nom du template
- `description` : Description
- `category` : Catégorie
- `layout` : Dimensions (width, height)
- `tags` : Tags pour le filtrage
- `isActive` : Statut actif
- `html` : Code HTML du template
- `variables` : Variables disponibles

## 🎨 Variables de marque

Tous les templates supportent les variables de marque :

- `{{brand.primaryColor}}` - Couleur primaire
- `{{brand.textColor}}` - Couleur du texte
- `{{brand.titleFont}}` - Police des titres
- `{{brand.textFont}}` - Police du texte
- `{{brand.logoUrl}}` - URL du logo

## 🔍 Vérification

Pour vérifier que tout fonctionne :

```bash
npm run add-templates list
```

Cela affichera tous les templates d'exemple disponibles en base de données.
