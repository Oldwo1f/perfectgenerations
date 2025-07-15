import { DataSource } from 'typeorm';
import { Template } from '../src/template/entities/template.entity';
import { Subscription, SubscriptionStatus } from '../src/billing/entities/subscription.entity';
import { Plan } from '../src/billing/entities/plan.entity';
import { User } from '../src/user/entities/user.entity';
import { UsageMonthly } from '../src/billing/entities/usage-monthly.entity';

async function testTemplateLimits(): Promise<void> {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'perfectgenerations',
    entities: [Template, Subscription, Plan, User, UsageMonthly],
    synchronize: false,
  });

  await dataSource.initialize();

  try {
    const templateRepository = dataSource.getRepository(Template);
    const subscriptionRepository = dataSource.getRepository(Subscription);

    console.log('Test de vérification des limites de templates...\n');

    // Récupérer un utilisateur de test (premier utilisateur trouvé)
    const subscriptions = await subscriptionRepository.find({
      where: { status: SubscriptionStatus.ACTIVE },
      relations: ['plan', 'user'],
    });

    if (subscriptions.length === 0) {
      console.log('❌ Aucun abonnement actif trouvé');
      return;
    }

    const subscription = subscriptions[0];
    const user = subscription.user;
    const plan = subscription.plan;

    console.log(`Utilisateur de test: ${user.email} (ID: ${user.id})`);
    console.log(`Plan actuel: ${plan.name} (Limite: ${plan.templateLimit} templates)`);

    // Compter les templates actuels
    const currentTemplateCount = await templateRepository.count({
      where: { userId: user.id },
    });

    console.log(`Templates actuels: ${currentTemplateCount}`);

    // Vérifier si l'utilisateur peut créer un nouveau template
    if (plan.templateLimit === -1) {
      console.log('✅ Plan illimité - Peut créer des templates sans limite');
    } else if (currentTemplateCount >= plan.templateLimit) {
      console.log(`❌ Limite atteinte - Ne peut pas créer plus de templates`);
      console.log(`   Limite: ${plan.templateLimit}, Actuel: ${currentTemplateCount}`);
    } else {
      console.log(
        `✅ Peut créer ${plan.templateLimit - currentTemplateCount} template(s) supplémentaire(s)`,
      );
    }

    // Afficher les templates existants
    const templates = await templateRepository.find({
      where: { userId: user.id },
    });

    if (templates.length > 0) {
      console.log('\nTemplates existants:');
      templates.forEach((template, index) => {
        console.log(`  ${index + 1}. ${template.name} (${template.category})`);
      });
    } else {
      console.log('\nAucun template existant');
    }

    // Test de simulation de création
    console.log('\n--- Test de simulation ---');
    if (plan.templateLimit === -1 || currentTemplateCount < plan.templateLimit) {
      console.log('✅ Simulation: Création de template autorisée');
    } else {
      console.log('❌ Simulation: Création de template refusée (limite atteinte)');
    }
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await dataSource.destroy();
  }
}

// Exécuter le test si le script est appelé directement
if (require.main === module) {
  testTemplateLimits()
    .then(() => {
      console.log('\n✅ Test terminé');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erreur fatale:', error);
      process.exit(1);
    });
}

export { testTemplateLimits };
