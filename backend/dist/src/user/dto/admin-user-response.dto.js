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
exports.AdminUserResponseDto = exports.UsageMonthlyDto = exports.UsageStorageDto = exports.SubscriptionInfoDto = exports.PlanInfoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../entities/user.entity");
const subscription_entity_1 = require("../../billing/entities/subscription.entity");
class PlanInfoDto {
}
exports.PlanInfoDto = PlanInfoDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PlanInfoDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PlanInfoDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PlanInfoDto.prototype, "priceMonthly", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PlanInfoDto.prototype, "imageLimitMonthly", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PlanInfoDto.prototype, "storageLimitBytes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PlanInfoDto.prototype, "templateLimit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PlanInfoDto.prototype, "brandLimit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PlanInfoDto.prototype, "teamMemberLimit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], PlanInfoDto.prototype, "integrationsIncluded", void 0);
class SubscriptionInfoDto {
}
exports.SubscriptionInfoDto = SubscriptionInfoDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SubscriptionInfoDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SubscriptionInfoDto.prototype, "planId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: subscription_entity_1.SubscriptionStatus }),
    __metadata("design:type", String)
], SubscriptionInfoDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], SubscriptionInfoDto.prototype, "stripeSubscriptionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Date)
], SubscriptionInfoDto.prototype, "currentPeriodEnd", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SubscriptionInfoDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PlanInfoDto }),
    __metadata("design:type", PlanInfoDto)
], SubscriptionInfoDto.prototype, "plan", void 0);
class UsageStorageDto {
}
exports.UsageStorageDto = UsageStorageDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UsageStorageDto.prototype, "bytesUsed", void 0);
class UsageMonthlyDto {
}
exports.UsageMonthlyDto = UsageMonthlyDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UsageMonthlyDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UsageMonthlyDto.prototype, "monthYear", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UsageMonthlyDto.prototype, "imagesGenerated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UsageMonthlyDto.prototype, "imagesUploaded", void 0);
class AdminUserResponseDto {
    get fullName() {
        return `${this.firstName || ''} ${this.lastName || ''}`.trim() || 'N/A';
    }
    get isSubscriptionActive() {
        if (this.role === user_entity_1.UserRole.ADMIN)
            return true;
        if (!this.subscription || !this.subscription.currentPeriodEnd)
            return false;
        return new Date() < this.subscription.currentPeriodEnd;
    }
    get monthlyImageLimit() {
        if (this.role === user_entity_1.UserRole.ADMIN)
            return 999999;
        return this.subscription?.plan?.imageLimitMonthly || 10;
    }
    get currentMonthImagesGenerated() {
        if (!this.monthlyUsage || this.monthlyUsage.length === 0)
            return 0;
        const currentMonth = new Date().toISOString().slice(0, 7);
        const usage = this.monthlyUsage.find((u) => u.monthYear === currentMonth);
        return usage ? usage.imagesGenerated : 0;
    }
    get canGenerateImage() {
        return this.imagesGeneratedThisMonth < this.monthlyImageLimit;
    }
}
exports.AdminUserResponseDto = AdminUserResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AdminUserResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AdminUserResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], AdminUserResponseDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], AdminUserResponseDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: user_entity_1.UserRole }),
    __metadata("design:type", String)
], AdminUserResponseDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: user_entity_1.UserStatus }),
    __metadata("design:type", String)
], AdminUserResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], AdminUserResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Date)
], AdminUserResponseDto.prototype, "lastLoginAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AdminUserResponseDto.prototype, "imagesGeneratedThisMonth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: SubscriptionInfoDto, required: false }),
    __metadata("design:type", SubscriptionInfoDto)
], AdminUserResponseDto.prototype, "subscription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: UsageStorageDto, required: false }),
    __metadata("design:type", UsageStorageDto)
], AdminUserResponseDto.prototype, "storageUsage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [UsageMonthlyDto] }),
    __metadata("design:type", Array)
], AdminUserResponseDto.prototype, "monthlyUsage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AdminUserResponseDto.prototype, "storageUsedMB", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AdminUserResponseDto.prototype, "storageLimitMB", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AdminUserResponseDto.prototype, "storageUsagePercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AdminUserResponseDto.prototype, "templatesCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AdminUserResponseDto.prototype, "brandsCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], AdminUserResponseDto.prototype, "fullName", null);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], AdminUserResponseDto.prototype, "isSubscriptionActive", null);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], AdminUserResponseDto.prototype, "monthlyImageLimit", null);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], AdminUserResponseDto.prototype, "currentMonthImagesGenerated", null);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], AdminUserResponseDto.prototype, "canGenerateImage", null);
//# sourceMappingURL=admin-user-response.dto.js.map