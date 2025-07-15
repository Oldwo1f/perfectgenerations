"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const plan_seeder_1 = require("./plan.seeder");
const typeorm_1 = require("typeorm");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const dataSource = app.get(typeorm_1.DataSource);
    try {
        console.log('Starting seeding...');
        await new plan_seeder_1.PlanSeeder().run(dataSource);
        console.log('Seeding complete.');
    }
    catch (error) {
        console.error('Seeding failed:', error);
    }
    finally {
        await app.close();
    }
}
bootstrap();
//# sourceMappingURL=seeder.js.map