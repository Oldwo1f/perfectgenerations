import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User, UserRole, UserStatus } from '../src/user/entities/user.entity';
import { Plan } from '../src/billing/entities/plan.entity';
import { Subscription, SubscriptionStatus } from '../src/billing/entities/subscription.entity';
import { UsageStorage } from '../src/billing/entities/usage-storage.entity';
import { UsageMonthly } from '../src/billing/entities/usage-monthly.entity';
import { Image } from '../src/images/entities/image.entity';
import { Brand } from '../src/brand/entities/brand.entity';
import { Template } from '../src/template/entities/template.entity';
import * as bcrypt from 'bcryptjs';

// Charger les variables d'environnement
config();

// Configuration de la base de données
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'perfectgenerations',
  entities: [User, Plan, Subscription, UsageStorage, UsageMonthly, Image, Brand, Template],
  synchronize: false,
});

async function createAdminUser(): Promise<void> {
  try {
    // Se connecter à la base de données
    await dataSource.initialize();
    console.log('✅ Connexion à la base de données établie');

    // Vérifier si l'utilisateur existe déjà
    const userRepository = dataSource.getRepository(User);
    const existingUser = await userRepository.findOne({
      where: { email: 'alexis@alexis.fr' },
    });

    if (existingUser) {
      console.log("⚠️  L'utilisateur alexis@alexis.fr existe déjà");

      // Mettre à jour le rôle en admin si nécessaire
      if (existingUser.role !== UserRole.ADMIN) {
        existingUser.role = UserRole.ADMIN;
        existingUser.status = UserStatus.ACTIVE;
        existingUser.emailVerifiedAt = new Date();
        await userRepository.save(existingUser);
        console.log('✅ Utilisateur mis à jour avec le rôle ADMIN');
      } else {
        console.log("✅ L'utilisateur est déjà admin");
      }

      await dataSource.destroy();
      return;
    }

    // Créer le nouvel utilisateur admin
    const hashedPassword = await bcrypt.hash('Alexis09', 12);

    const newUser = userRepository.create({
      email: 'alexis@alexis.fr',
      password: hashedPassword,
      firstName: 'Alexis',
      lastName: 'Admin',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerifiedAt: new Date(),
      acceptNewsletter: false,
      imagesGeneratedThisMonth: 0,
    });

    // Sauvegarder l'utilisateur
    const savedUser = await userRepository.save(newUser);
    console.log('✅ Utilisateur admin créé avec succès:', savedUser.id);

    // Créer un abonnement gratuit
    const planRepository = dataSource.getRepository(Plan);
    const freePlan = await planRepository.findOne({
      where: { id: 'free' },
    });

    if (freePlan) {
      const subscriptionRepository = dataSource.getRepository(Subscription);
      const subscription = subscriptionRepository.create({
        user: savedUser,
        plan: freePlan,
        status: SubscriptionStatus.ACTIVE,
      });
      await subscriptionRepository.save(subscription);
      console.log('✅ Abonnement gratuit créé');
    } else {
      console.log("⚠️  Plan gratuit non trouvé, création de l'abonnement ignorée");
    }

    // Créer l'enregistrement d'utilisation du stockage
    const usageStorageRepository = dataSource.getRepository(UsageStorage);
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
  } catch (error) {
    console.error("❌ Erreur lors de la création de l'utilisateur admin:", error);
  } finally {
    // Fermer la connexion
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('🔌 Connexion à la base de données fermée');
    }
  }
}

// Exécuter le script
createAdminUser();
