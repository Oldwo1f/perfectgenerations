"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const template_service_1 = require("../src/template/template.service");
async function deleteTemplates() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const templateService = app.get(template_service_1.TemplateService);
    try {
        console.log('🗑️  Début de la suppression des templates...\n');
        const templateIdsToDelete = [
            'edc16cc0-dd44-492a-9768-3c32e55e1e83',
            '46786d5f-10d7-4a98-a811-6b97da3dc574',
        ];
        for (const templateId of templateIdsToDelete) {
            try {
                console.log(`🗑️  Suppression du template ID: ${templateId}`);
                await templateService.remove(templateId);
                console.log(`✅ Template supprimé avec succès`);
            }
            catch (error) {
                console.error(`❌ Erreur lors de la suppression du template ${templateId}:`, error.message);
            }
        }
        console.log('\n📊 Résumé:');
        console.log(`- Templates supprimés: ${templateIdsToDelete.length}`);
        const exampleTemplates = await templateService.findExamples();
        console.log(`- Templates d'exemple restants: ${exampleTemplates.length}`);
        if (exampleTemplates.length > 0) {
            console.log("\n📋 Templates d'exemple restants:");
            exampleTemplates.forEach((template) => {
                console.log(`  - ${template.name} (${template.category}) - ID: ${template.id}`);
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
deleteTemplates()
    .then(() => {
    console.log('\n✅ Suppression terminée');
    process.exit(0);
})
    .catch((error) => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
});
//# sourceMappingURL=delete-templates.js.map