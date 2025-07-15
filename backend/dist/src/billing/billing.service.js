"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const subscription_entity_1 = require("./entities/subscription.entity");
const usage_storage_entity_1 = require("./entities/usage-storage.entity");
const plan_entity_1 = require("./entities/plan.entity");
const usage_monthly_entity_1 = require("./entities/usage-monthly.entity");
let BillingService = class BillingService {
    constructor(subscriptionRepository, usageStorageRepository, planRepository, usageMonthlyRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.usageStorageRepository = usageStorageRepository;
        this.planRepository = planRepository;
        this.usageMonthlyRepository = usageMonthlyRepository;
    }
    async getStorageInfo(userId) {
        const subscription = await this.subscriptionRepository.findOne({
            where: { userId, status: subscription_entity_1.SubscriptionStatus.ACTIVE },
            relations: ['plan'],
        });
        const usageStorage = await this.usageStorageRepository.findOne({
            where: { userId },
        });
        const bytesUsed = usageStorage ? Number(usageStorage.bytesUsed) : 0;
        if (!subscription) {
            const freePlan = await this.planRepository.findOne({
                where: { id: 'free' },
            });
            const storageLimitBytes = freePlan ? Number(freePlan.storageLimitBytes) : 100 * 1024 * 1024;
            const bytesAvailable = storageLimitBytes - bytesUsed;
            const usagePercentage = storageLimitBytes > 0 ? (bytesUsed / storageLimitBytes) * 100 : 0;
            return {
                planName: 'Free',
                storageLimitBytes,
                bytesUsed,
                bytesAvailable,
                usagePercentage,
                isUnlimited: false,
            };
        }
        const plan = subscription.plan;
        const storageLimitBytes = Number(plan.storageLimitBytes);
        const isUnlimited = storageLimitBytes === -1;
        const bytesAvailable = isUnlimited ? -1 : storageLimitBytes - bytesUsed;
        const usagePercentage = isUnlimited
            ? 0
            : storageLimitBytes > 0
                ? (bytesUsed / storageLimitBytes) * 100
                : 0;
        return {
            planName: plan.name,
            storageLimitBytes,
            bytesUsed,
            bytesAvailable,
            usagePercentage,
            isUnlimited,
        };
    }
    async incrementImagesGenerated(userId) {
        const currentMonth = new Date().toISOString().slice(0, 7);
        let usageMonthly = await this.usageMonthlyRepository.findOne({
            where: { userId, monthYear: currentMonth },
        });
        if (!usageMonthly) {
            usageMonthly = this.usageMonthlyRepository.create({
                userId,
                monthYear: currentMonth,
                imagesGenerated: 0,
                imagesUploaded: 0,
            });
        }
        usageMonthly.imagesGenerated += 1;
        await this.usageMonthlyRepository.save(usageMonthly);
    }
    async getImageUsageInfo(userId) {
        const currentMonth = new Date().toISOString().slice(0, 7);
        const subscription = await this.subscriptionRepository.findOne({
            where: { userId, status: subscription_entity_1.SubscriptionStatus.ACTIVE },
            relations: ['plan'],
        });
        const usageMonthly = await this.usageMonthlyRepository.findOne({
            where: { userId, monthYear: currentMonth },
        });
        const imagesGenerated = usageMonthly?.imagesGenerated || 0;
        if (!subscription) {
            const freePlan = await this.planRepository.findOne({
                where: { id: 'free' },
            });
            const imageLimitMonthly = freePlan ? freePlan.imageLimitMonthly : 50;
            const isUnlimited = imageLimitMonthly === -1;
            const usagePercentage = isUnlimited
                ? 0
                : imageLimitMonthly > 0
                    ? (imagesGenerated / imageLimitMonthly) * 100
                    : 0;
            return {
                planName: 'Free',
                imagesGenerated,
                imageLimitMonthly,
                usagePercentage,
                isUnlimited,
            };
        }
        const plan = subscription.plan;
        const imageLimitMonthly = plan.imageLimitMonthly;
        const isUnlimited = imageLimitMonthly === -1;
        const usagePercentage = isUnlimited
            ? 0
            : imageLimitMonthly > 0
                ? (imagesGenerated / imageLimitMonthly) * 100
                : 0;
        return {
            planName: plan.name,
            imagesGenerated,
            imageLimitMonthly,
            usagePercentage,
            isUnlimited,
        };
    }
};
exports.BillingService = BillingService;
exports.BillingService = BillingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subscription_entity_1.Subscription)),
    __param(1, (0, typeorm_1.InjectRepository)(usage_storage_entity_1.UsageStorage)),
    __param(2, (0, typeorm_1.InjectRepository)(plan_entity_1.Plan)),
    __param(3, (0, typeorm_1.InjectRepository)(usage_monthly_entity_1.UsageMonthly)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BillingService);
//# sourceMappingURL=billing.service.js.map