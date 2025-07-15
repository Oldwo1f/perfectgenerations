# Script d'ajout de templates

Ce script permet d'ajouter facilement des templates en base de données pour l'application Perfect Generations.

## Utilisation

### Script principal (add-templates.ts)

#### Ajouter tous les templates définis dans le script

```bash
npm run add-templates add-all
```

#### Lister tous les templates existants

```bash
npm run add-templates list
```

#### Afficher l'aide

```bash
npm run add-templates
```

### Script JSON (add-templates-from-json.ts)

#### Ajouter des templates depuis un fichier JSON

```bash
npm run add-templates-json add templates-examples.json
```

#### Valider un fichier JSON de templates

```bash
npm run add-templates-json validate templates-examples.json
```

#### Afficher l'aide

```bash
npm run add-templates-json
```

## Structure des templates

Chaque template doit suivre cette structure :

```typescript
{
  name: string;                    // Nom du template
  description: string;             // Description du template
  category: string;                // Catégorie (ex: "Témoignages", "Citations", etc.)
  layout: {                        // Dimensions du template
    width: number;
    height: number;
  };
  tags: string[];                  // Tags pour le filtrage
  isActive: boolean;               // Si le template est actif
  html: string;                    // Code HTML du template
  variables: Record<string, string>; // Variables disponibles dans le template
}
```

## Variables de template

Les variables sont définies comme des paires clé-valeur simples :

```typescript
variables: {
  title: "Titre de l'Événement",
  text: "Description de l'événement...",
  date: "Samedi 15 août 2025"
}
```

## Ajouter un nouveau template

### Méthode 1 : Directement dans le script

1. Ouvrez le fichier `add-templates.ts`
2. Ajoutez votre template dans le tableau `templatesToAdd`
3. Exécutez `npm run add-templates add-all`

### Méthode 2 : Via un fichier JSON (recommandé)

1. Créez ou modifiez un fichier JSON (ex: `templates-examples.json`)
2. Ajoutez vos templates dans le tableau `templates`
3. Validez le fichier : `npm run add-templates-json validate templates-examples.json`
4. Ajoutez les templates : `npm run add-templates-json add templates-examples.json`

### Exemple d'ajout d'un template

```typescript
const templatesToAdd: TemplateToAdd[] = [
  {
    name: 'Mon nouveau template',
    description: 'Description de mon template',
    category: 'Ma catégorie',
    layout: { width: 800, height: 600 },
    tags: ['tag1', 'tag2'],
    isActive: true,
    html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <style>
      body { margin: 0; padding: 20px; }
    </style>
  </head>
  <body>
    <h1>{{title}}</h1>
    <p>{{description}}</p>
  </body>
</html>`,
    variables: {
      title: 'Mon titre',
      description: 'Ma description',
    },
  },
];
```

## Fonctionnalités

- ✅ Vérification automatique des doublons (par nom)
- ✅ Création de templates d'exemple (sans utilisateur associé)
- ✅ Gestion des erreurs avec messages clairs
- ✅ Affichage des statistiques après ajout
- ✅ Support des variables de marque (`{{brand.primaryColor}}`, etc.)
- ✅ Validation de fichiers JSON
- ✅ Import depuis des fichiers JSON
- ✅ Gestion des erreurs de validation

## Variables de marque disponibles

Dans le HTML des templates, vous pouvez utiliser ces variables de marque :

- `{{brand.primaryColor}}` - Couleur primaire de la marque
- `{{brand.textColor}}` - Couleur du texte
- `{{brand.titleFont}}` - Police des titres
- `{{brand.textFont}}` - Police du texte
- `{{brand.logoUrl}}` - URL du logo

## Notes importantes

- Les templates créés sont des "templates d'exemple" (sans `userId`)
- Ils sont visibles par tous les utilisateurs
- Le script vérifie automatiquement les doublons par nom
- Les erreurs sont affichées mais n'arrêtent pas le traitement des autres templates
