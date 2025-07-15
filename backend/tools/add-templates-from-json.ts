import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { TemplateService } from '../src/template/template.service';
import { CreateTemplateDto } from '../src/template/dto/create-template.dto';
import * as fs from 'fs';

// Interface pour les templates à ajouter
interface TemplateToAdd {
  name: string;
  description: string;
  category: string;
  layout: { width: number; height: number };
  tags: string[];
  isActive: boolean;
  html: string;
  variables: Record<string, string>;
}

interface TemplatesFile {
  templates: TemplateToAdd[];
}

async function addTemplatesFromJson(filePath: string): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule);
  const templateService = app.get(TemplateService);

  try {
    console.log(`🚀 Lecture du fichier: ${filePath}\n`);

    // Vérifier si le fichier existe
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Le fichier ${filePath} n'existe pas`);
      return;
    }

    // Lire le fichier JSON
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const templatesData: TemplatesFile = JSON.parse(fileContent);

    if (!templatesData.templates || !Array.isArray(templatesData.templates)) {
      console.error(
        '❌ Format de fichier invalide. Le fichier doit contenir un tableau "templates"',
      );
      return;
    }

    console.log(`📝 ${templatesData.templates.length} templates trouvés dans le fichier\n`);

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const templateData of templatesData.templates) {
      try {
        console.log(`📝 Traitement du template: ${templateData.name}`);

        // Vérifier si le template existe déjà
        try {
          await templateService.findByName(templateData.name);
          console.log(`⚠️  Le template "${templateData.name}" existe déjà. Ignoré.`);
          skipCount++;
          continue;
        } catch (error) {
          // Le template n'existe pas, on peut continuer
        }

        // Préparer les données du template
        const createTemplateDto: CreateTemplateDto = {
          name: templateData.name,
          description: templateData.description,
          category: templateData.category,
          layout: {
            width: templateData.layout.width,
            height: templateData.layout.height,
            elements: [], // Éléments vides pour les templates d'exemple
          },
          tags: templateData.tags,
          isActive: templateData.isActive,
          html: templateData.html,
          variables: templateData.variables,
        };

        // Créer le template (sans userId pour en faire un template d'exemple)
        const createdTemplate = await templateService.createExample(createTemplateDto);

        console.log(
          `✅ Template "${createdTemplate.name}" ajouté avec succès (ID: ${createdTemplate.id})`,
        );
        successCount++;
      } catch (error) {
        console.error(
          `❌ Erreur lors de l'ajout du template "${templateData.name}":`,
          error.message,
        );
        errorCount++;
      }
    }

    console.log('\n📊 Résumé:');
    console.log(`- Templates traités: ${templatesData.templates.length}`);
    console.log(`- Templates ajoutés: ${successCount}`);
    console.log(`- Templates ignorés (doublons): ${skipCount}`);
    console.log(`- Erreurs: ${errorCount}`);

    // Afficher tous les templates d'exemple
    const exampleTemplates = await templateService.findExamples();
    console.log(`- Templates d'exemple en base: ${exampleTemplates.length}`);

    if (exampleTemplates.length > 0) {
      console.log("\n📋 Templates d'exemple disponibles:");
      exampleTemplates.forEach((template) => {
        console.log(`  - ${template.name} (${template.category})`);
      });
    }
  } catch (error) {
    console.error('❌ Erreur fatale:', error);
  } finally {
    await app.close();
  }
}

// Fonction pour valider un fichier JSON de templates
async function validateTemplatesFile(filePath: string): Promise<void> {
  try {
    console.log(`🔍 Validation du fichier: ${filePath}\n`);

    // Vérifier si le fichier existe
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Le fichier ${filePath} n'existe pas`);
      return;
    }

    // Lire le fichier JSON
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const templatesData: TemplatesFile = JSON.parse(fileContent);

    if (!templatesData.templates || !Array.isArray(templatesData.templates)) {
      console.error(
        '❌ Format de fichier invalide. Le fichier doit contenir un tableau "templates"',
      );
      return;
    }

    console.log(`✅ Format du fichier valide`);
    console.log(`📝 ${templatesData.templates.length} templates trouvés\n`);

    // Valider chaque template
    let validCount = 0;
    let invalidCount = 0;

    for (let i = 0; i < templatesData.templates.length; i++) {
      const template = templatesData.templates[i];
      const errors: string[] = [];

      // Vérifications de base
      if (!template.name) errors.push('Nom manquant');
      if (!template.description) errors.push('Description manquante');
      if (!template.category) errors.push('Catégorie manquante');
      if (!template.layout) errors.push('Layout manquant');
      if (!template.layout?.width) errors.push('Largeur du layout manquante');
      if (!template.layout?.height) errors.push('Hauteur du layout manquante');
      if (!template.html) errors.push('HTML manquant');
      if (!template.variables) errors.push('Variables manquantes');

      if (errors.length > 0) {
        console.log(`❌ Template ${i + 1} "${template.name || 'Sans nom'}": ${errors.join(', ')}`);
        invalidCount++;
      } else {
        console.log(`✅ Template ${i + 1} "${template.name}": Valide`);
        validCount++;
      }
    }

    console.log('\n📊 Résumé de validation:');
    console.log(`- Templates valides: ${validCount}`);
    console.log(`- Templates invalides: ${invalidCount}`);
  } catch (error) {
    console.error('❌ Erreur lors de la validation:', error.message);
  }
}

// Gestion des arguments de ligne de commande
const args = process.argv.slice(2);
const command = args[0];
const filePath = args[1] || 'templates-examples.json';

switch (command) {
  case 'add':
    addTemplatesFromJson(filePath)
      .then(() => {
        console.log('\n✅ Ajout des templates terminé');
        process.exit(0);
      })
      .catch((error) => {
        console.error('❌ Erreur fatale:', error);
        process.exit(1);
      });
    break;

  case 'validate':
    validateTemplatesFile(filePath)
      .then(() => {
        console.log('\n✅ Validation terminée');
        process.exit(0);
      })
      .catch((error) => {
        console.error('❌ Erreur fatale:', error);
        process.exit(1);
      });
    break;

  default:
    console.log('📖 Utilisation:');
    console.log(
      '  npm run add-templates-json add [fichier.json]    - Ajouter des templates depuis un fichier JSON',
    );
    console.log(
      '  npm run add-templates-json validate [fichier.json] - Valider un fichier JSON de templates',
    );
    console.log('\n💡 Exemple:');
    console.log('  npm run add-templates-json add templates-examples.json');
    console.log('  npm run add-templates-json validate templates-examples.json');
    process.exit(0);
}
