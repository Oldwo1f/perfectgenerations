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
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserStatus = exports.UserRole = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const bcrypt = require("bcryptjs");
const subscription_entity_1 = require("../../billing/entities/subscription.entity");
const usage_monthly_entity_1 = require("../../billing/entities/usage-monthly.entity");
const usage_storage_entity_1 = require("../../billing/entities/usage-storage.entity");
const image_entity_1 = require("../../images/entities/image.entity");
const brand_entity_1 = require("../../brand/entities/brand.entity");
const template_entity_1 = require("../../template/entities/template.entity");
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "user";
    UserRole["ADMIN"] = "admin";
})(UserRole || (exports.UserRole = UserRole = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["INACTIVE"] = "inactive";
    UserStatus["SUSPENDED"] = "suspended";
    UserStatus["PENDING_VERIFICATION"] = "pending_verification";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
let User = class User {
    async hashPassword() {
        if (this.password && this.password.length < 60) {
            this.password = await bcrypt.hash(this.password, 12);
        }
    }
    async validatePassword(password) {
        return bcrypt.compare(password, this.password);
    }
    getFullName() {
        return `${this.firstName || ''} ${this.lastName || ''}`.trim();
    }
    isEmailVerified() {
        return !!this.emailVerifiedAt;
    }
    isSubscriptionActive() {
        if (this.role === UserRole.ADMIN)
            return true;
        if (!this.subscription || !this.subscription.currentPeriodEnd)
            return false;
        return new Date() < this.subscription.currentPeriodEnd;
    }
    getMonthlyImageLimit() {
        switch (this.role) {
            case UserRole.USER:
                return 10;
            case UserRole.ADMIN:
                return 999999;
            default:
                return 10;
        }
    }
    canGenerateImage() {
        return this.imagesGeneratedThisMonth < this.getMonthlyImageLimit();
    }
    resetMonthlyUsage() {
        this.imagesGeneratedThisMonth = 0;
        this.monthlyUsageResetAt = new Date();
    }
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "acceptNewsletter", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: UserStatus,
        default: UserStatus.PENDING_VERIFICATION,
    }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar' }),
    __metadata("design:type", Object)
], User.prototype, "emailVerificationToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'timestamp' }),
    __metadata("design:type", Object)
], User.prototype, "emailVerifiedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar' }),
    __metadata("design:type", Object)
], User.prototype, "passwordResetToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'timestamp' }),
    __metadata("design:type", Object)
], User.prototype, "passwordResetExpires", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "lastLoginAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "subscriptionEndsAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "imagesGeneratedThisMonth", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "monthlyUsageResetAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => subscription_entity_1.Subscription, (subscription) => subscription.user),
    __metadata("design:type", subscription_entity_1.Subscription)
], User.prototype, "subscription", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => usage_monthly_entity_1.UsageMonthly, (usage) => usage.user),
    __metadata("design:type", Array)
], User.prototype, "monthlyUsage", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => usage_storage_entity_1.UsageStorage, (usage) => usage.user),
    __metadata("design:type", usage_storage_entity_1.UsageStorage)
], User.prototype, "storageUsage", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => image_entity_1.Image, (image) => image.user),
    __metadata("design:type", Array)
], User.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => brand_entity_1.Brand, (brand) => brand.user),
    __metadata("design:type", Array)
], User.prototype, "brands", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => template_entity_1.Template, (template) => template.user),
    __metadata("design:type", Array)
], User.prototype, "templates", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "apiKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isApiOnly", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], User.prototype, "hashPassword", null);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
//# sourceMappingURL=user.entity.js.map