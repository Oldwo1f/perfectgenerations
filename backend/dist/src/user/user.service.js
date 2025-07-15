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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const crypto = require("crypto");
const plan_entity_1 = require("../billing/entities/plan.entity");
const subscription_entity_1 = require("../billing/entities/subscription.entity");
const usage_storage_entity_1 = require("../billing/entities/usage-storage.entity");
const usage_monthly_entity_1 = require("../billing/entities/usage-monthly.entity");
const image_entity_1 = require("../images/entities/image.entity");
const brand_entity_1 = require("../brand/entities/brand.entity");
const template_entity_1 = require("../template/entities/template.entity");
let UserService = class UserService {
    constructor(userRepository, planRepository, subscriptionRepository, usageStorageRepository, usageMonthlyRepository, imageRepository, brandRepository, templateRepository, jwtService, configService, entityManager, dataSource) {
        this.userRepository = userRepository;
        this.planRepository = planRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.usageStorageRepository = usageStorageRepository;
        this.usageMonthlyRepository = usageMonthlyRepository;
        this.imageRepository = imageRepository;
        this.brandRepository = brandRepository;
        this.templateRepository = templateRepository;
        this.jwtService = jwtService;
        this.configService = configService;
        this.entityManager = entityManager;
        this.dataSource = dataSource;
    }
    async create(registerUserDto) {
        const existingUser = await this.userRepository.findOne({
            where: { email: registerUserDto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        let user = null;
        await this.entityManager.transaction(async (transactionalEntityManager) => {
            const newUser = transactionalEntityManager.create(user_entity_1.User, {
                ...registerUserDto,
                emailVerificationToken: crypto.randomBytes(32).toString('hex'),
            });
            await transactionalEntityManager.save(newUser);
            const freePlan = await transactionalEntityManager.findOne(plan_entity_1.Plan, {
                where: { id: 'free' },
            });
            if (!freePlan) {
                throw new common_1.InternalServerErrorException('Default "free" plan not found.');
            }
            const subscription = transactionalEntityManager.create(subscription_entity_1.Subscription, {
                user: newUser,
                plan: freePlan,
                status: subscription_entity_1.SubscriptionStatus.ACTIVE,
            });
            await transactionalEntityManager.save(subscription);
            const usageStorage = transactionalEntityManager.create(usage_storage_entity_1.UsageStorage, {
                user: newUser,
                bytesUsed: 0,
            });
            await transactionalEntityManager.save(usageStorage);
            user = newUser;
        });
        if (!user) {
            throw new common_1.InternalServerErrorException('Failed to create user.');
        }
        return user;
    }
    async findByEmail(email) {
        return this.userRepository.findOne({ where: { email } });
    }
    async findById(id) {
        return this.userRepository.findOne({ where: { id } });
    }
    async validateUser(loginUserDto) {
        const user = await this.findByEmail(loginUserDto.email);
        if (!user) {
            throw new common_1.BadRequestException('Invalid credentials');
        }
        const isPasswordValid = await user.validatePassword(loginUserDto.password);
        if (!isPasswordValid) {
            throw new common_1.BadRequestException('Invalid credentials');
        }
        if (user.status === user_entity_1.UserStatus.PENDING_VERIFICATION) {
            user.status = user_entity_1.UserStatus.ACTIVE;
            user.emailVerifiedAt = new Date();
            user.emailVerificationToken = null;
            await this.userRepository.save(user);
        }
        else if (user.status !== user_entity_1.UserStatus.ACTIVE) {
            throw new common_1.BadRequestException('Account is not active');
        }
        return user;
    }
    async updateLastLogin(userId) {
        await this.userRepository.update(userId, {
            lastLoginAt: new Date(),
        });
    }
    async verifyEmail(token) {
        const user = await this.userRepository.findOne({
            where: { emailVerificationToken: token },
        });
        if (!user) {
            throw new common_1.NotFoundException('Invalid verification token');
        }
        user.status = user_entity_1.UserStatus.ACTIVE;
        user.emailVerifiedAt = new Date();
        user.emailVerificationToken = null;
        return this.userRepository.save(user);
    }
    async requestPasswordReset(email) {
        const user = await this.findByEmail(email);
        if (!user) {
            return;
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        user.passwordResetToken = resetToken;
        user.passwordResetExpires = resetExpires;
        await this.userRepository.save(user);
        console.log(`Password reset token for ${email}: ${resetToken}`);
    }
    async resetPassword(token, newPassword) {
        const user = await this.userRepository.findOne({
            where: { passwordResetToken: token },
        });
        if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
            throw new common_1.BadRequestException('Invalid or expired reset token');
        }
        user.password = newPassword;
        user.passwordResetToken = null;
        user.passwordResetExpires = null;
        await this.userRepository.save(user);
    }
    async generateApiKey(userId) {
        const user = await this.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const apiKey = `pk_${crypto.randomBytes(32).toString('hex')}`;
        user.apiKey = apiKey;
        await this.userRepository.save(user);
        return apiKey;
    }
    async findByApiKey(apiKey) {
        return this.userRepository.findOne({ where: { apiKey } });
    }
    async findAll() {
        return this.userRepository.find({
            select: [
                'id',
                'email',
                'firstName',
                'lastName',
                'role',
                'status',
                'createdAt',
                'lastLoginAt',
            ],
            relations: ['subscription', 'subscription.plan', 'storageUsage', 'monthlyUsage'],
        });
    }
    async getTemplatesCount(userId) {
        return this.templateRepository.count({
            where: { userId },
        });
    }
    async getBrandsCount(userId) {
        return this.brandRepository.count({
            where: { userId },
        });
    }
    async updateUser(userId, updateData) {
        const user = await this.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        Object.assign(user, updateData);
        return this.userRepository.save(user);
    }
    async deleteUser(userId) {
        const result = await this.userRepository.delete(userId);
        if (result.affected === 0) {
            throw new common_1.NotFoundException('User not found');
        }
    }
    async update(id, updateUserDto) {
        const user = await this.userRepository.preload({
            id: id,
            ...updateUserDto,
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return this.userRepository.save(user);
    }
    async adminUpdate(id, updateUserDto) {
        const user = await this.userRepository.preload({
            id: id,
            ...updateUserDto,
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return this.userRepository.save(user);
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const isPasswordMatching = await user.validatePassword(currentPassword);
        if (!isPasswordMatching) {
            throw new common_1.BadRequestException('Invalid current password');
        }
        user.password = newPassword;
        await this.userRepository.save(user);
    }
    async updateStatus(id, status) {
        const user = await this.findById(id);
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        user.status = status;
        return this.userRepository.save(user);
    }
    async delete(id) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const user = await this.userRepository.findOne({ where: { id } });
            if (!user) {
                throw new common_1.NotFoundException(`User with ID ${id} not found`);
            }
            await this.subscriptionRepository.delete({ userId: id });
            await this.usageMonthlyRepository.delete({ userId: id });
            await this.usageStorageRepository.delete({ userId: id });
            await this.imageRepository.delete({ user: { id } });
            await this.brandRepository.delete({ user: { id } });
            await this.templateRepository.delete({ user: { id } });
            const result = await this.userRepository.delete(id);
            if (result.affected === 0) {
                throw new common_1.NotFoundException(`User with ID ${id} could not be deleted`);
            }
            await queryRunner.commitTransaction();
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async changeUserPlan(userId, planId) {
        console.log(`Changing plan for user ${userId} to plan ${planId}`);
        const plan = await this.planRepository.findOne({ where: { id: planId } });
        if (!plan) {
            throw new common_1.NotFoundException(`Plan with ID ${planId} not found`);
        }
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['subscription'],
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        console.log(`Current subscription plan: ${user.subscription?.planId || 'none'}`);
        if (!user.subscription) {
            console.log('Creating new subscription');
            const subscription = this.subscriptionRepository.create({
                userId: user.id,
                planId,
                status: subscription_entity_1.SubscriptionStatus.ACTIVE,
            });
            await this.subscriptionRepository.save(subscription);
        }
        else {
            console.log(`Updating subscription from ${user.subscription.planId} to ${planId}`);
            await this.subscriptionRepository.update({ id: user.subscription.id }, { planId: planId });
        }
        const updatedUser = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.subscription', 'subscription')
            .leftJoinAndSelect('subscription.plan', 'plan')
            .leftJoinAndSelect('user.storageUsage', 'storageUsage')
            .leftJoinAndSelect('user.monthlyUsage', 'monthlyUsage')
            .where('user.id = :userId', { userId })
            .getOne();
        if (!updatedUser) {
            throw new common_1.NotFoundException('User not found after plan change');
        }
        console.log('-------------------------------------------');
        console.log('updatedUser =>', updatedUser);
        console.log(`Updated subscription plan: ${updatedUser.subscription?.planId}`);
        console.log(`Updated plan name: ${updatedUser.subscription?.plan?.name}`);
        return updatedUser;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(plan_entity_1.Plan)),
    __param(2, (0, typeorm_1.InjectRepository)(subscription_entity_1.Subscription)),
    __param(3, (0, typeorm_1.InjectRepository)(usage_storage_entity_1.UsageStorage)),
    __param(4, (0, typeorm_1.InjectRepository)(usage_monthly_entity_1.UsageMonthly)),
    __param(5, (0, typeorm_1.InjectRepository)(image_entity_1.Image)),
    __param(6, (0, typeorm_1.InjectRepository)(brand_entity_1.Brand)),
    __param(7, (0, typeorm_1.InjectRepository)(template_entity_1.Template)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService,
        typeorm_2.EntityManager,
        typeorm_2.DataSource])
], UserService);
//# sourceMappingURL=user.service.js.map