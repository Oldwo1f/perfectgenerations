"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./src/app.module");
const template_service_1 = require("./src/template/template.service");
const templatesToAdd = [
    {
        name: 'Témoignages utilisateur',
        description: 'Un template épuré pour annoncer des événements spéciaux, mettant en avant un titre, une description et une date, avec des couleurs et polices personnalisables.',
        category: 'Témoignages',
        layout: { width: 600, height: 1024 },
        tags: ['Témoignages', 'annonce'],
        isActive: true,
        html: `<!DOCTYPE html>
<html lang="fr" style="width: 600px; height: 1024px; overflow: hidden;">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web/css/phosphor.css">
  <style>
    body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: {{brand.primaryColor}};
      font-family: {{brand.textFont}}, sans-serif;
      color: {{brand.textColor}};
    }
    .container {
      text-align: center;
      padding: 20px;
    }
    .title {
      font-size: 48px;
      font-family: {{brand.titleFont}}, sans-serif;
      margin-bottom: 20px;
    }
    .text {
      font-size: 24px;
      margin-bottom: 20px;
    }
    .date {
      font-size: 20px;
      font-style: italic;
    }
    .logo {
      width: 100px;
      height: 100px;
      background-image: url('{{brand.logoUrl}}');
      background-size: cover;
      border-radius: 50%;
      position: absolute;
      bottom: 20px;
      right: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="title">{{title}}</div>
    <div class="text">{{text}}</div>
    <div class="date">{{date}}</div>
  </div>
  <div class="logo"></div>
</body>
</html>`,
        variables: {
            title: "Titre de l'Événement",
            text: "Description de l'événement à venir, avec tous les détails nécessaires pour les participants.",
            date: 'Samedi 15 août 2025',
        },
    },
];
async function addTemplates() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const templateService = app.get(template_service_1.TemplateService);
    try {
        console.log("🚀 Début de l'ajout des templates...\n");
        for (const templateData of templatesToAdd) {
            try {
                console.log(`📝 Ajout du template: ${templateData.name}`);
                try {
                    await templateService.findByName(templateData.name);
                    console.log(`⚠️  Le template "${templateData.name}" existe déjà. Ignoré.`);
                    continue;
                }
                catch (error) {
                }
                const createTemplateDto = {
                    name: templateData.name,
                    description: templateData.description,
                    category: templateData.category,
                    layout: {
                        width: templateData.layout.width,
                        height: templateData.layout.height,
                        elements: [],
                    },
                    tags: templateData.tags,
                    isActive: templateData.isActive,
                    html: templateData.html,
                    variables: templateData.variables,
                };
                const createdTemplate = await templateService.createExample(createTemplateDto);
                console.log(`✅ Template "${createdTemplate.name}" ajouté avec succès (ID: ${createdTemplate.id})`);
            }
            catch (error) {
                console.error(`❌ Erreur lors de l'ajout du template "${templateData.name}":`, error.message);
            }
        }
        console.log('\n📊 Résumé:');
        console.log(`- Templates traités: ${templatesToAdd.length}`);
        const exampleTemplates = await templateService.findExamples();
        console.log(`- Templates d'exemple en base: ${exampleTemplates.length}`);
        if (exampleTemplates.length > 0) {
            console.log("\n📋 Templates d'exemple disponibles:");
            exampleTemplates.forEach((template) => {
                console.log(`  - ${template.name} (${template.category})`);
            });
        }
    }
    catch (error) {
        console.error('❌ Erreur fatale:', error);
    }
    finally {
        await app.close();
    }
}
async function listAllTemplates() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const templateService = app.get(template_service_1.TemplateService);
    try {
        console.log('📋 Liste de tous les templates:\n');
        const exampleTemplates = await templateService.findExamples();
        console.log(`🎯 Templates d'exemple (${exampleTemplates.length}):`);
        exampleTemplates.forEach((template) => {
            console.log(`  - ${template.name} (${template.category}) - ID: ${template.id}`);
        });
        console.log('\n📊 Statistiques:');
        console.log(`- Templates d'exemple: ${exampleTemplates.length}`);
    }
    catch (error) {
        console.error('❌ Erreur:', error);
    }
    finally {
        await app.close();
    }
}
const args = process.argv.slice(2);
const command = args[0];
switch (command) {
    case 'add-all':
        addTemplates()
            .then(() => {
            console.log('\n✅ Ajout de tous les templates terminé');
            process.exit(0);
        })
            .catch((error) => {
            console.error('❌ Erreur fatale:', error);
            process.exit(1);
        });
        break;
    case 'list':
        listAllTemplates()
            .then(() => {
            console.log('\n✅ Liste terminée');
            process.exit(0);
        })
            .catch((error) => {
            console.error('❌ Erreur fatale:', error);
            process.exit(1);
        });
        break;
    default:
        console.log('📖 Utilisation:');
        console.log('  npm run add-templates add-all    - Ajouter tous les templates');
        console.log('  npm run add-templates list       - Lister tous les templates');
        console.log('\n💡 Pour ajouter un template spécifique, modifiez le script et utilisez addSpecificTemplate()');
        process.exit(0);
}
//# sourceMappingURL=add-templates.js.map