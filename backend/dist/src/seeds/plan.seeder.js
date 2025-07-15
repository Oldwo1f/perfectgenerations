"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanSeeder = void 0;
const plan_entity_1 = require("../billing/entities/plan.entity");
class PlanSeeder {
    async run(dataSource) {
        const planRepository = dataSource.getRepository(plan_entity_1.Plan);
        const plans = [
            {
                id: 'free',
                name: 'Free',
                priceMonthly: 0,
                imageLimitMonthly: 50,
                storageLimitBytes: 15 * 1024 * 1024,
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
                storageLimitBytes: 100 * 1024 * 1024,
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
                storageLimitBytes: 500 * 1024 * 1024,
                templateLimit: 9999,
                brandLimit: 9999,
                teamMemberLimit: 3,
                integrationsIncluded: true,
            },
            {
                id: 'enterprise',
                name: 'Enterprise',
                priceMonthly: 99,
                imageLimitMonthly: -1,
                storageLimitBytes: -1,
                templateLimit: -1,
                brandLimit: -1,
                teamMemberLimit: -1,
                integrationsIncluded: true,
            },
        ];
        await planRepository.save(plans);
        console.log('Plans have been seeded');
    }
}
exports.PlanSeeder = PlanSeeder;
//# sourceMappingURL=plan.seeder.js.map