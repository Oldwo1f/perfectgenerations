import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Brand } from '../src/brand/entities/brand.entity';
import { Subscription, SubscriptionStatus } from '../src/billing/entities/subscription.entity';
import { Plan } from '../src/billing/entities/plan.entity';

// Charger les variables d'environnement
config();

async function testBrandLimits(): Promise<void> {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [Brand, Subscription, Plan],
    synchronize: false,
  });

  await dataSource.initialize();

  try {
    const brandRepository = dataSource.getRepository(Brand);
    const subscriptionRepository = dataSource.getRepository(Subscription);

    console.log('Test de vérification des limites de marques...\n');

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
    console.log(`Plan actuel: ${plan.name} (Limite: ${plan.brandLimit} marques)`);

    // Compter les marques actuelles
    const currentBrandCount = await brandRepository.count({
      where: { userId: user.id },
    });

    console.log(`Marques actuelles: ${currentBrandCount}`);

    // Vérifier si l'utilisateur peut créer une nouvelle marque
    if (plan.brandLimit === -1) {
      console.log('✅ Plan illimité - Peut créer des marques sans limite');
    } else if (currentBrandCount >= plan.brandLimit) {
      console.log(`❌ Limite atteinte - Ne peut pas créer plus de marques`);
      console.log(`   Limite: ${plan.brandLimit}, Actuel: ${currentBrandCount}`);
    } else {
      console.log(
        `✅ Peut créer ${plan.brandLimit - currentBrandCount} marque(s) supplémentaire(s)`,
      );
    }

    // Afficher toutes les marques de l'utilisateur
    const brands = await brandRepository.find({
      where: { userId: user.id },
    });

    if (brands.length > 0) {
      console.log('\nMarques existantes:');
      brands.forEach((brand, index) => {
        console.log(`  ${index + 1}. ${brand.name}`);
      });
    } else {
      console.log('\nAucune marque existante');
    }
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await dataSource.destroy();
  }
}

testBrandLimits();
