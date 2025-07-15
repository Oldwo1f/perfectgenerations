import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { TemplateService } from '../src/template/template.service';

async function testTemplateCreation(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule);
  const templateService = app.get(TemplateService);

  try {
    console.log('🧪 Test de création de templates...\n');

    // Récupérer un utilisateur de test
    const userRepository = app.get('UserRepository');
    const users = await userRepository.find();

    if (users.length === 0) {
      console.log('❌ Aucun utilisateur trouvé');
      return;
    }

    const testUser = users[0];
    console.log(`Utilisateur de test: ${testUser.email}`);

    // Test de création d'un template
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
    } catch (error) {
      if (error.message.includes('Limite de templates atteinte')) {
        console.log('❌ Limite de templates atteinte (comportement attendu)');
        console.log("Message d'erreur:", error.message);
      } else {
        console.log('❌ Erreur inattendue:', error.message);
      }
    }
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await app.close();
  }
}

// Exécuter le test
testTemplateCreation()
  .then(() => {
    console.log('\n✅ Test terminé');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
