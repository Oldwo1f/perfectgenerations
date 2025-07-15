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
exports.BrandService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const brand_entity_1 = require("./entities/brand.entity");
const subscription_entity_1 = require("../billing/entities/subscription.entity");
const plan_entity_1 = require("../billing/entities/plan.entity");
let BrandService = class BrandService {
    constructor(brandRepository, subscriptionRepository, planRepository) {
        this.brandRepository = brandRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.planRepository = planRepository;
    }
    async findAll() {
        return this.brandRepository.find();
    }
    async findAllByUser(userId) {
        return this.brandRepository.find({ where: { userId } });
    }
    async findOne(id) {
        const brand = await this.brandRepository.findOne({ where: { id } });
        if (!brand) {
            throw new common_1.NotFoundException(`Brand with ID ${id} not found`);
        }
        return brand;
    }
    async findOneByUser(id, userId) {
        const brand = await this.brandRepository.findOne({ where: { id, userId } });
        if (!brand) {
            throw new common_1.NotFoundException(`Brand with ID ${id} not found`);
        }
        return brand;
    }
    async create(createBrandDto) {
        await this.checkBrandLimit(createBrandDto.userId);
        const newBrand = this.brandRepository.create({
            ...createBrandDto,
            imageGroups: createBrandDto.imageGroups.map((group) => ({
                groupName: group.groupName,
                images_url: group.images_url.map((img) => img.url),
            })),
        });
        return this.brandRepository.save(newBrand);
    }
    async update(id, brand) {
        const existingBrand = await this.findOne(id);
        const updatedBrand = this.brandRepository.merge(existingBrand, brand);
        return this.brandRepository.save(updatedBrand);
    }
    async updateByUser(id, updateBrandDto, userId) {
        const existingBrand = await this.findOneByUser(id, userId);
        const updateData = { ...updateBrandDto };
        delete updateData.id;
        delete updateData.userId;
        if (updateBrandDto.imageGroups) {
            updateData.imageGroups = updateBrandDto.imageGroups.map((group) => ({
                groupName: group.groupName,
                images_url: group.images_url.map((img) => img.url),
            }));
        }
        const updatedBrand = this.brandRepository.merge(existingBrand, updateData);
        return this.brandRepository.save(updatedBrand);
    }
    async remove(id) {
        const result = await this.brandRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Brand with ID ${id} not found`);
        }
    }
    async removeByUser(id, userId) {
        const result = await this.brandRepository.delete({ id, userId });
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Brand with ID ${id} not found`);
        }
    }
    async findByName(name) {
        const brand = await this.brandRepository.findOne({ where: { name } });
        if (!brand) {
            throw new common_1.NotFoundException(`Brand with name "${name}" not found`);
        }
        return brand;
    }
    async findByNameForUser(name, userId) {
        const brand = await this.brandRepository.findOne({ where: { name, userId } });
        if (!brand) {
            throw new common_1.NotFoundException(`Brand with name "${name}" not found for the current user`);
        }
        return brand;
    }
    async checkBrandLimit(userId) {
        const subscription = await this.subscriptionRepository.findOne({
            where: { user: { id: userId }, status: subscription_entity_1.SubscriptionStatus.ACTIVE },
            relations: ['plan'],
        });
        if (!subscription) {
            throw new common_1.ForbiddenException('Aucun abonnement actif trouvé. Veuillez souscrire à un plan pour créer des marques.');
        }
        const plan = subscription.plan;
        if (plan.brandLimit === -1) {
            return;
        }
        const currentBrandCount = await this.brandRepository.count({
            where: { userId },
        });
        if (currentBrandCount >= plan.brandLimit) {
            throw new common_1.ForbiddenException(`Limite de marques atteinte. Votre plan ${plan.name} permet ${plan.brandLimit} marque(s). ` +
                `Vous avez actuellement ${currentBrandCount} marque(s). ` +
                'Veuillez mettre à niveau votre plan pour créer plus de marques.');
        }
    }
};
exports.BrandService = BrandService;
exports.BrandService = BrandService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(brand_entity_1.Brand)),
    __param(1, (0, typeorm_1.InjectRepository)(subscription_entity_1.Subscription)),
    __param(2, (0, typeorm_1.InjectRepository)(plan_entity_1.Plan)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BrandService);
//# sourceMappingURL=brand.service.js.map