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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const image_entity_1 = require("../images/entities/image.entity");
const brand_entity_1 = require("../brand/entities/brand.entity");
const template_entity_1 = require("../template/entities/template.entity");
const usage_monthly_entity_1 = require("../billing/entities/usage-monthly.entity");
const billing_service_1 = require("../billing/billing.service");
let DashboardService = class DashboardService {
    constructor(userRepository, imageRepository, brandRepository, templateRepository, usageMonthlyRepository, billingService) {
        this.userRepository = userRepository;
        this.imageRepository = imageRepository;
        this.brandRepository = brandRepository;
        this.templateRepository = templateRepository;
        this.usageMonthlyRepository = usageMonthlyRepository;
        this.billingService = billingService;
    }
    async getStats(userId) {
        const currentMonth = new Date().toISOString().slice(0, 7);
        const [imagesCount, brandsCount, templatesCount, usageMonthly, storageInfo, imageUsageInfo] = await Promise.all([
            this.imageRepository.count({ where: { user: { id: userId } } }),
            this.brandRepository.count({ where: { user: { id: userId } } }),
            this.templateRepository.count({ where: { user: { id: userId } } }),
            this.usageMonthlyRepository.findOne({
                where: { userId, monthYear: currentMonth },
            }),
            this.billingService.getStorageInfo(userId),
            this.billingService.getImageUsageInfo(userId),
        ]);
        return {
            imagesGenerated: usageMonthly?.imagesGenerated || 0,
            imagesUploaded: imagesCount,
            brandsCreated: brandsCount,
            templatesUsed: templatesCount,
            storageInfo,
            imageUsageInfo,
        };
    }
    async getActivity(userId) {
        const recentImages = await this.imageRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
            take: 5,
        });
        const recentBrands = await this.brandRepository.find({
            where: { user: { id: userId } },
            take: 5,
        });
        const recentTemplates = await this.templateRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
            take: 5,
        });
        const activities = [
            ...recentImages.map((img) => ({
                id: img.id,
                title: 'Image uploadée',
                description: `Nouvelle image: ${img.originalName}`,
                icon: 'ph-duotone ph-image',
                createdAt: img.createdAt.toISOString(),
            })),
            ...recentBrands.map((brand) => ({
                id: brand.id,
                title: 'Marque créée',
                description: `Nouvelle marque: ${brand.name}`,
                icon: 'ph-duotone ph-palette',
                createdAt: new Date().toISOString(),
            })),
            ...recentTemplates.map((template) => ({
                id: template.id,
                title: 'Template créé',
                description: `Nouveau template: ${template.name}`,
                icon: 'ph-duotone ph-file-text',
                createdAt: template.createdAt.toISOString(),
            })),
        ];
        return activities
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 10);
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(image_entity_1.Image)),
    __param(2, (0, typeorm_1.InjectRepository)(brand_entity_1.Brand)),
    __param(3, (0, typeorm_1.InjectRepository)(template_entity_1.Template)),
    __param(4, (0, typeorm_1.InjectRepository)(usage_monthly_entity_1.UsageMonthly)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        billing_service_1.BillingService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map