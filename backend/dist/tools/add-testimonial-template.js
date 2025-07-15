"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const template_service_1 = require("../src/template/template.service");
const testimonialTemplate = {
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
};
async function addTestimonialTemplate() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const templateService = app.get(template_service_1.TemplateService);
    try {
        console.log('🚀 Ajout du template de témoignages utilisateur...\n');
        try {
            await templateService.findByName(testimonialTemplate.name);
            console.log(`⚠️  Le template "${testimonialTemplate.name}" existe déjà.`);
            console.log('💡 Utilisez le script principal pour gérer les templates existants.');
            return;
        }
        catch (error) {
        }
        const createTemplateDto = {
            name: testimonialTemplate.name,
            description: testimonialTemplate.description,
            category: testimonialTemplate.category,
            layout: {
                width: testimonialTemplate.layout.width,
                height: testimonialTemplate.layout.height,
                elements: [],
            },
            tags: testimonialTemplate.tags,
            isActive: testimonialTemplate.isActive,
            html: testimonialTemplate.html,
            variables: testimonialTemplate.variables,
        };
        const createdTemplate = await templateService.createExample(createTemplateDto);
        console.log(`✅ Template "${createdTemplate.name}" ajouté avec succès !`);
        console.log(`📋 Détails:`);
        console.log(`   - ID: ${createdTemplate.id}`);
        console.log(`   - Catégorie: ${createdTemplate.category}`);
        console.log(`   - Dimensions: ${createdTemplate.layout.width}x${createdTemplate.layout.height}`);
        console.log(`   - Variables: ${Object.keys(createdTemplate.variables).join(', ')}`);
        console.log('\n🎨 Variables disponibles dans ce template:');
        console.log("   - {{title}} - Titre de l'événement");
        console.log("   - {{text}} - Description de l'événement");
        console.log("   - {{date}} - Date de l'événement");
        console.log('   - {{brand.primaryColor}} - Couleur primaire de la marque');
        console.log('   - {{brand.textColor}} - Couleur du texte');
        console.log('   - {{brand.titleFont}} - Police des titres');
        console.log('   - {{brand.textFont}} - Police du texte');
        console.log('   - {{brand.logoUrl}} - URL du logo');
    }
    catch (error) {
        console.error("❌ Erreur lors de l'ajout du template:", error.message);
    }
    finally {
        await app.close();
    }
}
addTestimonialTemplate()
    .then(() => {
    console.log('\n✅ Script terminé avec succès');
    process.exit(0);
})
    .catch((error) => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
});
//# sourceMappingURL=add-testimonial-template.js.map