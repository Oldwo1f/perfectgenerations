"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const user_service_1 = require("./user.service");
const user_entity_1 = require("./entities/user.entity");
const billing_module_1 = require("../billing/billing.module");
const user_controller_1 = require("./user.controller");
const admin_user_controller_1 = require("./admin-user.controller");
const image_entity_1 = require("../images/entities/image.entity");
const brand_entity_1 = require("../brand/entities/brand.entity");
const template_entity_1 = require("../template/entities/template.entity");
const subscription_entity_1 = require("../billing/entities/subscription.entity");
const usage_monthly_entity_1 = require("../billing/entities/usage-monthly.entity");
const usage_storage_entity_1 = require("../billing/entities/usage-storage.entity");
const validation_config_1 = require("../common/config/validation.config");
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                subscription_entity_1.Subscription,
                usage_monthly_entity_1.UsageMonthly,
                usage_storage_entity_1.UsageStorage,
                image_entity_1.Image,
                brand_entity_1.Brand,
                template_entity_1.Template,
            ]),
            jwt_1.JwtModule.registerAsync({
                useFactory: async (configService) => ({
                    secret: (0, validation_config_1.validateJwtSecret)(configService),
                    signOptions: { expiresIn: '24h' },
                }),
                inject: [config_1.ConfigService],
            }),
            billing_module_1.BillingModule,
        ],
        controllers: [user_controller_1.UserController, admin_user_controller_1.AdminUserController],
        providers: [user_service_1.UserService],
        exports: [user_service_1.UserService, typeorm_1.TypeOrmModule],
    })
], UserModule);
//# sourceMappingURL=user.module.js.map