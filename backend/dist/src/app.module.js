"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const throttler_1 = require("@nestjs/throttler");
const throttler_storage_redis_1 = require("@nestjs/throttler-storage-redis");
const core_1 = require("@nestjs/core");
const brand_module_1 = require("./brand/brand.module");
const template_module_1 = require("./template/template.module");
const generate_module_1 = require("./generate/generate.module");
const images_module_1 = require("./images/images.module");
const user_module_1 = require("./user/user.module");
const auth_module_1 = require("./auth/auth.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const billing_module_1 = require("./billing/billing.module");
const health_module_1 = require("./health/health.module");
const logger_module_1 = require("./common/logger/logger.module");
const brand_entity_1 = require("./brand/entities/brand.entity");
const template_entity_1 = require("./template/entities/template.entity");
const image_entity_1 = require("./images/entities/image.entity");
const user_entity_1 = require("./user/entities/user.entity");
const plan_entity_1 = require("./billing/entities/plan.entity");
const subscription_entity_1 = require("./billing/entities/subscription.entity");
const usage_monthly_entity_1 = require("./billing/entities/usage-monthly.entity");
const usage_storage_entity_1 = require("./billing/entities/usage-storage.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            logger_module_1.LoggerModule,
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => {
                    const redisHost = configService.get('REDIS_HOST', 'localhost');
                    const redisPort = configService.get('REDIS_PORT', 6379);
                    const redisPassword = configService.get('REDIS_PASSWORD');
                    const useRedis = redisHost && redisHost !== 'localhost';
                    const config = {
                        ttl: 60,
                        limit: 100,
                    };
                    if (useRedis) {
                        config.storage = new throttler_storage_redis_1.ThrottlerStorageRedisService({
                            host: redisHost,
                            port: redisPort,
                            password: redisPassword || undefined,
                        });
                    }
                    return config;
                },
                inject: [config_1.ConfigService],
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT || '5432', 10),
                username: process.env.DB_USERNAME || 'postgres',
                password: process.env.DB_PASSWORD || 'postgres',
                database: process.env.DB_DATABASE || 'perfectgenerations',
                entities: [brand_entity_1.Brand, template_entity_1.Template, image_entity_1.Image, user_entity_1.User, plan_entity_1.Plan, subscription_entity_1.Subscription, usage_monthly_entity_1.UsageMonthly, usage_storage_entity_1.UsageStorage],
                synchronize: process.env.NODE_ENV !== 'production',
            }),
            brand_module_1.BrandModule,
            template_module_1.TemplateModule,
            generate_module_1.GenerateModule,
            images_module_1.ImagesModule,
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            dashboard_module_1.DashboardModule,
            billing_module_1.BillingModule,
            health_module_1.HealthModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map