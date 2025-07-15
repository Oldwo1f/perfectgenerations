"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testTemplateLimits = testTemplateLimits;
const typeorm_1 = require("typeorm");
const template_entity_1 = require("../src/template/entities/template.entity");
const subscription_entity_1 = require("../src/billing/entities/subscription.entity");
const plan_entity_1 = require("../src/billing/entities/plan.entity");
const user_entity_1 = require("../src/user/entities/user.entity");
const usage_monthly_entity_1 = require("../src/billing/entities/usage-monthly.entity");
async function testTemplateLimits() {
    const dataSource = new typeorm_1.DataSource({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_DATABASE || 'perfectgenerations',
        entities: [template_entity_1.Template, subscription_entity_1.Subscription, plan_entity_1.Plan, user_entity_1.User, usage_monthly_entity_1.UsageMonthly],
        synchronize: false,
    });
    await dataSource.initialize();
    try {
        const templateRepository = dataSource.getRepository(template_entity_1.Template);
        const subscriptionRepository = dataSource.getRepository(subscription_entity_1.Subscription);
        console.log('Test de vérification des limites de templates...\n');
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
        console.log(`Plan actuel: ${plan.name} (Limite: ${plan.templateLimit} templates)`);
        const currentTemplateCount = await templateRepository.count({
            where: { userId: user.id },
        });
        console.log(`Templates actuels: ${currentTemplateCount}`);
        if (plan.templateLimit === -1) {
            console.log('✅ Plan illimité - Peut créer des templates sans limite');
        }
        else if (currentTemplateCount >= plan.templateLimit) {
            console.log(`❌ Limite atteinte - Ne peut pas créer plus de templates`);
            console.log(`   Limite: ${plan.templateLimit}, Actuel: ${currentTemplateCount}`);
        }
        else {
            console.log(`✅ Peut créer ${plan.templateLimit - currentTemplateCount} template(s) supplémentaire(s)`);
        }
        const templates = await templateRepository.find({
            where: { userId: user.id },
        });
        if (templates.length > 0) {
            console.log('\nTemplates existants:');
            templates.forEach((template, index) => {
                console.log(`  ${index + 1}. ${template.name} (${template.category})`);
            });
        }
        else {
            console.log('\nAucun template existant');
        }
        console.log('\n--- Test de simulation ---');
        if (plan.templateLimit === -1 || currentTemplateCount < plan.templateLimit) {
            console.log('✅ Simulation: Création de template autorisée');
        }
        else {
            console.log('❌ Simulation: Création de template refusée (limite atteinte)');
        }
    }
    catch (error) {
        console.error('❌ Erreur lors du test:', error);
    }
    finally {
        await dataSource.destroy();
    }
}
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
//# sourceMappingURL=test-template-limits.js.map