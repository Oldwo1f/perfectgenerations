"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const user_entity_1 = require("../src/user/entities/user.entity");
const plan_entity_1 = require("../src/billing/entities/plan.entity");
const subscription_entity_1 = require("../src/billing/entities/subscription.entity");
const usage_storage_entity_1 = require("../src/billing/entities/usage-storage.entity");
const usage_monthly_entity_1 = require("../src/billing/entities/usage-monthly.entity");
const image_entity_1 = require("../src/images/entities/image.entity");
const brand_entity_1 = require("../src/brand/entities/brand.entity");
const template_entity_1 = require("../src/template/entities/template.entity");
const bcrypt = require("bcryptjs");
(0, dotenv_1.config)();
const dataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'perfectgenerations',
    entities: [user_entity_1.User, plan_entity_1.Plan, subscription_entity_1.Subscription, usage_storage_entity_1.UsageStorage, usage_monthly_entity_1.UsageMonthly, image_entity_1.Image, brand_entity_1.Brand, template_entity_1.Template],
    synchronize: false,
});
async function createAdminUser() {
    try {
        await dataSource.initialize();
        console.log('✅ Connexion à la base de données établie');
        const userRepository = dataSource.getRepository(user_entity_1.User);
        const existingUser = await userRepository.findOne({
            where: { email: 'alexis@alexis.fr' },
        });
        if (existingUser) {
            console.log("⚠️  L'utilisateur alexis@alexis.fr existe déjà");
            if (existingUser.role !== user_entity_1.UserRole.ADMIN) {
                existingUser.role = user_entity_1.UserRole.ADMIN;
                existingUser.status = user_entity_1.UserStatus.ACTIVE;
                existingUser.emailVerifiedAt = new Date();
                await userRepository.save(existingUser);
                console.log('✅ Utilisateur mis à jour avec le rôle ADMIN');
            }
            else {
                console.log("✅ L'utilisateur est déjà admin");
            }
            await dataSource.destroy();
            return;
        }
        const hashedPassword = await bcrypt.hash('Alexis09', 12);
        const newUser = userRepository.create({
            email: 'alexis@alexis.fr',
            password: hashedPassword,
            firstName: 'Alexis',
            lastName: 'Admin',
            role: user_entity_1.UserRole.ADMIN,
            status: user_entity_1.UserStatus.ACTIVE,
            emailVerifiedAt: new Date(),
            acceptNewsletter: false,
            imagesGeneratedThisMonth: 0,
        });
        const savedUser = await userRepository.save(newUser);
        console.log('✅ Utilisateur admin créé avec succès:', savedUser.id);
        const planRepository = dataSource.getRepository(plan_entity_1.Plan);
        const freePlan = await planRepository.findOne({
            where: { id: 'free' },
        });
        if (freePlan) {
            const subscriptionRepository = dataSource.getRepository(subscription_entity_1.Subscription);
            const subscription = subscriptionRepository.create({
                user: savedUser,
                plan: freePlan,
                status: subscription_entity_1.SubscriptionStatus.ACTIVE,
            });
            await subscriptionRepository.save(subscription);
            console.log('✅ Abonnement gratuit créé');
        }
        else {
            console.log("⚠️  Plan gratuit non trouvé, création de l'abonnement ignorée");
        }
        const usageStorageRepository = dataSource.getRepository(usage_storage_entity_1.UsageStorage);
        const usageStorage = usageStorageRepository.create({
            user: savedUser,
            bytesUsed: 0,
        });
        await usageStorageRepository.save(usageStorage);
        console.log("✅ Enregistrement d'utilisation du stockage créé");
        console.log('\n🎉 Utilisateur admin créé avec succès!');
        console.log('📧 Email: alexis@alexis.fr');
        console.log('🔑 Mot de passe: Alexis09');
        console.log('👤 Rôle: ADMIN');
    }
    catch (error) {
        console.error("❌ Erreur lors de la création de l'utilisateur admin:", error);
    }
    finally {
        if (dataSource.isInitialized) {
            await dataSource.destroy();
            console.log('🔌 Connexion à la base de données fermée');
        }
    }
}
createAdminUser();
//# sourceMappingURL=create-admin-user.js.map