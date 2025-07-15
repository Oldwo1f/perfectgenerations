"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const plan_entity_1 = require("./entities/plan.entity");
const subscription_entity_1 = require("./entities/subscription.entity");
const usage_monthly_entity_1 = require("./entities/usage-monthly.entity");
const usage_storage_entity_1 = require("./entities/usage-storage.entity");
const plan_controller_1 = require("./plan.controller");
const plan_service_1 = require("./plan.service");
const billing_controller_1 = require("./billing.controller");
const billing_service_1 = require("./billing.service");
let BillingModule = class BillingModule {
};
exports.BillingModule = BillingModule;
exports.BillingModule = BillingModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([plan_entity_1.Plan, subscription_entity_1.Subscription, usage_monthly_entity_1.UsageMonthly, usage_storage_entity_1.UsageStorage])],
        controllers: [plan_controller_1.PlanController, billing_controller_1.BillingController],
        providers: [plan_service_1.PlanService, billing_service_1.BillingService],
        exports: [typeorm_1.TypeOrmModule, plan_service_1.PlanService, billing_service_1.BillingService],
    })
], BillingModule);
//# sourceMappingURL=billing.module.js.map