"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const template_service_1 = require("../src/template/template.service");
const templatesToAdd = [
    {
        name: 'Client Review Card',
        description: "A sleek testimonial card template displaying a user's review, profile photo, name, and star rating. Perfect for showcasing customer feedback on service or hospitality websites. Colors, fonts, and branding are fully customizable.",
        category: 'Testimonials',
        layout: { width: 600, height: 1024 },
        tags: ['review', 'testimonial', 'user', 'feedback', 'stars'],
        isActive: true,
        html: '<!DOCTYPE html>\n<html lang="en" style="width:600px;height:1024px;overflow:hidden;">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web/css/phosphor.css">\n  <style>\n    body {\n      width: 100%;\n      height: 100%;\n      margin: 0;\n      padding: 0;\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      justify-content: center;\n      background: {{brand.primaryColor}};\n      font-family: {{brand.textFont}}, sans-serif;\n      color: {{brand.textColor}};\n    }\n    .heading {\n      margin-top: 80px;\n      font-family: {{brand.titleFont}}, serif;\n      font-size: 48px;\n      font-style: italic;\n      font-weight: normal;\n      letter-spacing: 1px;\n      color: #fff;\n      text-align: center;\n    }\n    .review-card {\n      background: #fff;\n      border-radius: 20px;\n      box-shadow: 0 4px 16px rgba(0,0,0,0.07);\n      width: 480px;\n      margin: 56px 0;\n      position: relative;\n      padding: 70px 40px 40px 40px;\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n    }\n    .avatar-holder {\n      position: absolute;\n      top: -60px;\n      left: 50%;\n      transform: translateX(-50%);\n      width: 120px;\n      height: 120px;\n      border-radius: 60px;\n      background: #fff;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      box-shadow: 0 4px 16px rgba(0,0,0,0.04);\n    }\n    .avatar-img {\n      width: 104px;\n      height: 104px;\n      border-radius: 52px;\n      object-fit: cover;\n    }\n    .review-text {\n      font-size: 22px;\n      margin: 28px 0 18px 0;\n      text-align: center;\n      color: #222;\n      font-family: {{brand.textFont}}, sans-serif;\n    }\n    .user-name {\n      font-weight: 700;\n      text-transform: uppercase;\n      letter-spacing: 1.5px;\n      margin-bottom: 12px;\n      font-size: 19px;\n      color: #222;\n      font-family: {{brand.titleFont}}, sans-serif;\n    }\n    .stars {\n      margin-bottom: 2px;\n      color: #222;\n      font-size: 28px;\n      letter-spacing: 6px;\n    }\n  </style>\n</head>\n<body>\n  <div class="heading">CLIENT REVIEW</div>\n  <div class="review-card">\n    <div class="avatar-holder">\n      <img class="avatar-img" src="{{userAvatarUrl}}" alt="{{userName}} avatar" />\n    </div>\n    <div class="review-text">{{reviewText}}</div>\n    <div class="user-name">{{userName}}</div>\n    <div class="stars">\n      {{#each (range 1 (add rating 1))}}<i class="ph-fill ph-star"></i>{{/each}}\n    </div>\n  </div>\n</body>\n</html>',
        variables: {
            userName: { value: 'Hailey Gomez', type: 'text' },
            userAvatarUrl: {
                value: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80',
                type: 'text',
            },
            reviewText: {
                value: 'A fantastic stay for the price! The home was tidy, well-furnished, and had all the amenities we needed. The check-in process was seamless and the host was very accommodating.',
                type: 'textarea',
            },
            rating: { value: '4', type: 'text' },
        },
    },
    {
        name: 'Promotion Banner',
        description: 'A vibrant promotional banner template with customizable text, background colors, and call-to-action elements. Perfect for marketing campaigns and special offers.',
        category: 'Promotions',
        layout: { width: 1200, height: 400 },
        tags: ['promotion', 'banner', 'marketing', 'sale', 'cta'],
        isActive: true,
        html: `<!DOCTYPE html>
<html lang="en" style="width:1200px;height:400px;overflow:hidden;">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web/css/phosphor.css">
  <style>
    body {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, {{brand.primaryColor}}, {{brand.secondaryColor}});
      font-family: {{brand.textFont}}, sans-serif;
      color: {{brand.textColor}};
    }
    .banner {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 60px;
      position: relative;
    }
    .content {
      flex: 1;
      text-align: left;
    }
    .title {
      font-family: {{brand.titleFont}}, serif;
      font-size: 48px;
      font-weight: bold;
      margin-bottom: 16px;
      color: #fff;
    }
    .subtitle {
      font-size: 24px;
      margin-bottom: 32px;
      color: rgba(255,255,255,0.9);
    }
    .cta-button {
      background: #fff;
      color: {{brand.primaryColor}};
      padding: 16px 32px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: bold;
      font-size: 18px;
      display: inline-block;
      transition: transform 0.2s;
    }
    .cta-button:hover {
      transform: scale(1.05);
    }
    .image-container {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .promo-image {
      max-width: 300px;
      max-height: 300px;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    }
  </style>
</head>
<body>
  <div class="banner">
    <div class="content">
      <div class="title">{{mainTitle}}</div>
      <div class="subtitle">{{subtitle}}</div>
      <a href="{{ctaLink}}" class="cta-button">{{ctaText}}</a>
    </div>
    <div class="image-container">
      <img class="promo-image" src="{{promoImageUrl}}" alt="{{imageAlt}}" />
    </div>
  </div>
</body>
</html>`,
        variables: {
            mainTitle: { value: 'SPECIAL OFFER - 50% OFF', type: 'text' },
            subtitle: {
                value: "Limited time offer on all premium products. Don't miss out on this amazing deal!",
                type: 'textarea',
            },
            ctaText: { value: 'SHOP NOW', type: 'text' },
            ctaLink: { value: 'https://example.com/shop', type: 'text' },
            promoImageUrl: {
                value: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80',
                type: 'text',
            },
            imageAlt: { value: 'Product promotion', type: 'text' },
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
                    const existingTemplate = await templateService.findByName(templateData.name);
                    console.log(`🗑️  Suppression du template existant: ${templateData.name}`);
                    await templateService.remove(existingTemplate.id);
                }
                catch (error) {
                }
                const convertedVariables = templateData.variables;
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
                    variables: convertedVariables,
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