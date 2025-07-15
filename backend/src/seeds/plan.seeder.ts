import { DataSource } from 'typeorm';
import { Plan } from '../billing/entities/plan.entity';

export class PlanSeeder {
  public async run(dataSource: DataSource): Promise<void> {
    const planRepository = dataSource.getRepository(Plan);

    const plans: Partial<Plan>[] = [
      {
        id: 'free',
        name: 'Free',
        priceMonthly: 0,
        imageLimitMonthly: 50,
        storageLimitBytes: 15 * 1024 * 1024, // 15 MB
        templateLimit: 3,
        brandLimit: 1,
        teamMemberLimit: 1,
        integrationsIncluded: true,
      },
      {
        id: 'starter',
        name: 'Starter',
        priceMonthly: 9,
        imageLimitMonthly: 500,
        storageLimitBytes: 100 * 1024 * 1024, // 100 MB
        templateLimit: 20,
        brandLimit: 5,
        teamMemberLimit: 1,
        integrationsIncluded: true,
      },
      {
        id: 'pro',
        name: 'Pro',
        priceMonthly: 49,
        imageLimitMonthly: 5000,
        storageLimitBytes: 500 * 1024 * 1024, // 500 MB
        templateLimit: 9999, // "Unlimited"
        brandLimit: 9999, // "Unlimited"
        teamMemberLimit: 3,
        integrationsIncluded: true,
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        priceMonthly: 99, // Price on quote
        imageLimitMonthly: -1, // Unlimited
        storageLimitBytes: -1, // Unlimited
        templateLimit: -1, // Unlimited
        brandLimit: -1, // Unlimited
        teamMemberLimit: -1, // Unlimited
        integrationsIncluded: true,
      },
    ];

    // Use save to "upsert" data, avoiding duplicates on re-runs
    await planRepository.save(plans);

    console.log('Plans have been seeded');
  }
}
