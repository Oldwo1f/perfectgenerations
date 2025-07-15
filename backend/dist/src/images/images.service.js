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
exports.ImagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const image_entity_1 = require("./entities/image.entity");
const subscription_entity_1 = require("../billing/entities/subscription.entity");
const usage_storage_entity_1 = require("../billing/entities/usage-storage.entity");
const subscription_entity_2 = require("../billing/entities/subscription.entity");
const fs = require("fs/promises");
const path_1 = require("path");
let ImagesService = class ImagesService {
    constructor(imageRepository, subscriptionRepository, usageStorageRepository, entityManager) {
        this.imageRepository = imageRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.usageStorageRepository = usageStorageRepository;
        this.entityManager = entityManager;
    }
    async findAll(userId) {
        return this.imageRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
        });
    }
    async create(image, user) {
        const subscription = await this.subscriptionRepository.findOne({
            where: { userId: user.id, status: subscription_entity_2.SubscriptionStatus.ACTIVE },
            relations: ['plan'],
        });
        let plan;
        if (!subscription) {
            plan = {
                storageLimitBytes: 100 * 1024 * 1024,
                name: 'Free Plan',
            };
        }
        else {
            plan = subscription.plan;
        }
        const newImageSize = image.size;
        const currentUsage = await this.usageStorageRepository.findOne({
            where: { userId: user.id },
        });
        const currentBytesUsed = currentUsage ? Number(currentUsage.bytesUsed) : 0;
        if (plan.storageLimitBytes !== -1 &&
            currentBytesUsed + newImageSize > plan.storageLimitBytes) {
            const filePath = (0, path_1.join)(process.cwd(), 'uploads', 'images', image.filename);
            try {
                await fs.unlink(filePath);
            }
            catch (error) {
                console.error(`Failed to delete orphaned file: ${filePath}`, error);
            }
            throw new common_1.ForbiddenException('Storage limit exceeded.');
        }
        const newImage = this.imageRepository.create({
            ...image,
            user: { id: user.id },
        });
        const savedImage = await this.imageRepository.save(newImage);
        if (currentUsage) {
            currentUsage.bytesUsed = Number(currentUsage.bytesUsed) + newImageSize;
            await this.usageStorageRepository.save(currentUsage);
        }
        else {
            throw new common_1.InternalServerErrorException('Usage storage record not found for user');
        }
        return savedImage;
    }
    async findOne(id, userId) {
        return this.imageRepository.findOne({
            where: { id, user: { id: userId } },
            relations: ['user'],
        });
    }
    async delete(id, userId) {
        const image = await this.findOne(id, userId);
        if (!image) {
            throw new common_1.NotFoundException('Image not found');
        }
        await this.imageRepository.delete(id);
        const storageUsage = await this.usageStorageRepository.findOne({
            where: { userId },
        });
        if (storageUsage) {
            storageUsage.bytesUsed = Math.max(0, Number(storageUsage.bytesUsed) - image.size);
            await this.usageStorageRepository.save(storageUsage);
        }
        else {
            console.warn('No usage storage record found for user during deletion');
        }
        const filePath = (0, path_1.join)(process.cwd(), 'uploads', 'images', image.filename);
        try {
            await fs.unlink(filePath);
        }
        catch (error) {
            console.error(`Failed to delete file: ${filePath}`, error);
            throw new common_1.InternalServerErrorException('Failed to delete file asset.');
        }
    }
};
exports.ImagesService = ImagesService;
exports.ImagesService = ImagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(image_entity_1.Image)),
    __param(1, (0, typeorm_1.InjectRepository)(subscription_entity_1.Subscription)),
    __param(2, (0, typeorm_1.InjectRepository)(usage_storage_entity_1.UsageStorage)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.EntityManager])
], ImagesService);
//# sourceMappingURL=images.service.js.map