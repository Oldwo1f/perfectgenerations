# 🛠️ Outils Backend

Ce dossier contient tous les scripts et outils utilitaires pour la gestion du backend Perfect Generations.

## 📁 Structure des outils

### 🎨 **Gestion des Templates**

- `add-templates.ts` - Script principal pour ajouter des templates
- `add-templates-from-json.ts` - Ajout de templates depuis un fichier JSON
- `add-testimonial-template.ts` - Script spécifique pour le template de témoignages
- `templates-examples.json` - Exemples de templates prêts à l'emploi
- `ADD_TEMPLATES_README.md` - Documentation complète des templates
- `TEMPLATES_SCRIPTS_SUMMARY.md` - Résumé des scripts de templates

### 🧪 **Tests et Validation**

- `test-template-creation.ts` - Test de création de templates
- `test-template-limits.ts` - Test des limites de templates
- `test-brand-limits.ts` - Test des limites de marques
- `test-new-api.ts` - Test de nouvelles API
- `test-template-limit-sql.sql` - Script SQL pour les tests de limites

### 👤 **Administration**

- `create-admin-user.ts` - Création d'utilisateur administrateur
- `create-admin.sh` - Script shell pour créer un admin
- `CREATE_ADMIN_README.md` - Documentation pour la création d'admin

## 🚀 Utilisation rapide

### Templates

```bash
# Ajouter tous les templates définis
npm run add-templates add-all

# Ajouter depuis un fichier JSON
npm run add-templates-json add tools/templates-examples.json

# Ajouter le template de témoignages
npm run add-testimonial

# Lister tous les templates
npm run add-templates list
```

### Tests

```bash
# Tests de limites
npm run test:template-limits
npm run test:brand-limits
```

### Administration

```bash
# Créer un utilisateur admin
npm run create-admin
```

## 📋 Commandes disponibles

| Commande                       | Description            | Fichier                             |
| ------------------------------ | ---------------------- | ----------------------------------- |
| `npm run add-templates`        | Gestion des templates  | `tools/add-templates.ts`            |
| `npm run add-templates-json`   | Templates depuis JSON  | `tools/add-templates-from-json.ts`  |
| `npm run add-testimonial`      | Template témoignages   | `tools/add-testimonial-template.ts` |
| `npm run test:template-limits` | Test limites templates | `tools/test-template-limits.ts`     |
| `npm run test:brand-limits`    | Test limites marques   | `tools/test-brand-limits.ts`        |
| `npm run create-admin`         | Créer admin            | `tools/create-admin-user.ts`        |

## 🔧 Développement

### Ajouter un nouvel outil

1. Créez votre script dans le dossier `tools/`
2. Ajoutez la commande npm dans `package.json`
3. Documentez l'outil dans ce README

### Structure recommandée pour un script

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';

async function main(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    // Votre logique ici
    console.log('✅ Script terminé avec succès');
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await app.close();
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
```

## 📚 Documentation

- **Templates :** Voir `ADD_TEMPLATES_README.md`
- **Administration :** Voir `CREATE_ADMIN_README.md`
- **Résumé :** Voir `TEMPLATES_SCRIPTS_SUMMARY.md`

## 🎯 Bonnes pratiques

1. **Toujours fermer l'application** avec `await app.close()`
2. **Gérer les erreurs** avec try/catch
3. **Afficher des messages clairs** avec des emojis
4. **Documenter** chaque nouvel outil
5. **Tester** avant de déployer
6. **Utiliser des chemins relatifs** pour les imports

## 🔍 Debugging

Pour déboguer un script :

```bash
# Avec Node.js debugger
node --inspect-brk -r ts-node/register -r tsconfig-paths/register tools/votre-script.ts

# Avec plus de logs
DEBUG=* npm run votre-commande
```
