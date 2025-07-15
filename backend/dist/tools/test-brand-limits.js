"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const brand_entity_1 = require("../src/brand/entities/brand.entity");
const subscription_entity_1 = require("../src/billing/entities/subscription.entity");
const plan_entity_1 = require("../src/billing/entities/plan.entity");
(0, dotenv_1.config)();
async function testBrandLimits() {
    const dataSource = new typeorm_1.DataSource({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        entities: [brand_entity_1.Brand, subscription_entity_1.Subscription, plan_entity_1.Plan],
        synchronize: false,
    });
    await dataSource.initialize();
    try {
        const brandRepository = dataSource.getRepository(brand_entity_1.Brand);
        const subscriptionRepository = dataSource.getRepository(subscription_entity_1.Subscription);
        console.log('Test de vérification des limites de marques...\n');
        const subscriptions = await subscriptionRepository.find({
            where: { status: subscription_entity_1.SubscriptionStatus.ACTIVE },
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
        const currentBrandCount = await brandRepository.count({
            where: { userId: user.id },
        });
        console.log(`Marques actuelles: ${currentBrandCount}`);
        if (plan.brandLimit === -1) {
            console.log('✅ Plan illimité - Peut créer des marques sans limite');
        }
        else if (currentBrandCount >= plan.brandLimit) {
            console.log(`❌ Limite atteinte - Ne peut pas créer plus de marques`);
            console.log(`   Limite: ${plan.brandLimit}, Actuel: ${currentBrandCount}`);
        }
        else {
            console.log(`✅ Peut créer ${plan.brandLimit - currentBrandCount} marque(s) supplémentaire(s)`);
        }
        const brands = await brandRepository.find({
            where: { userId: user.id },
        });
        if (brands.length > 0) {
            console.log('\nMarques existantes:');
            brands.forEach((brand, index) => {
                console.log(`  ${index + 1}. ${brand.name}`);
            });
        }
        else {
            console.log('\nAucune marque existante');
        }
    }
    catch (error) {
        console.error('❌ Erreur lors du test:', error);
    }
    finally {
        await dataSource.destroy();
    }
}
testBrandLimits();
//# sourceMappingURL=test-brand-limits.js.map