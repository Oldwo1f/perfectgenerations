"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const template_service_1 = require("../src/template/template.service");
async function testTemplateCreation() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const templateService = app.get(template_service_1.TemplateService);
    try {
        console.log('🧪 Test de création de templates...\n');
        const userRepository = app.get('UserRepository');
        const users = await userRepository.find();
        if (users.length === 0) {
            console.log('❌ Aucun utilisateur trouvé');
            return;
        }
        const testUser = users[0];
        console.log(`Utilisateur de test: ${testUser.email}`);
        const testTemplate = {
            name: 'Template de test',
            description: 'Template créé pour tester les limites',
            category: 'Citations',
            layout: {
                width: 800,
                height: 600,
                elements: [],
            },
            tags: ['test'],
            isActive: true,
            userId: testUser.id,
        };
        console.log("📝 Tentative de création d'un template...");
        try {
            const createdTemplate = await templateService.create(testTemplate);
            console.log('✅ Template créé avec succès:', createdTemplate.name);
        }
        catch (error) {
            if (error.message.includes('Limite de templates atteinte')) {
                console.log('❌ Limite de templates atteinte (comportement attendu)');
                console.log("Message d'erreur:", error.message);
            }
            else {
                console.log('❌ Erreur inattendue:', error.message);
            }
        }
    }
    catch (error) {
        console.error('❌ Erreur lors du test:', error);
    }
    finally {
        await app.close();
    }
}
testTemplateCreation()
    .then(() => {
    console.log('\n✅ Test terminé');
    process.exit(0);
})
    .catch((error) => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
});
//# sourceMappingURL=test-template-creation.js.map