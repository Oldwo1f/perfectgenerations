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
exports.AdminUserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("./entities/user.entity");
const create_user_dto_1 = require("./dto/create-user.dto");
const admin_update_user_dto_1 = require("./dto/admin-update-user.dto");
const update_user_status_dto_1 = require("./dto/update-user-status.dto");
const admin_user_response_dto_1 = require("./dto/admin-user-response.dto");
const change_user_plan_dto_1 = require("./dto/change-user-plan.dto");
let AdminUserController = class AdminUserController {
    constructor(userService) {
        this.userService = userService;
    }
    async findAll() {
        const users = await this.userService.findAll();
        const responses = await Promise.all(users.map((user) => this.transformToAdminResponse(user)));
        return responses;
    }
    async findOne(id) {
        const user = await this.userService.findById(id);
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        const { password: _password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async create(createUserDto) {
        const user = await this.userService.create(createUserDto);
        const { password: _password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async update(id, updateUserDto) {
        const user = await this.userService.adminUpdate(id, updateUserDto);
        const { password: _password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async updateStatus(id, updateStatusDto) {
        const user = await this.userService.updateStatus(id, updateStatusDto.status);
        const { password: _password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async remove(id) {
        await this.userService.delete(id);
    }
    async changeUserPlan(id, changeUserPlanDto) {
        const user = await this.userService.changeUserPlan(id, changeUserPlanDto.planId);
        return await this.transformToAdminResponse(user);
    }
    async transformToAdminResponse(user) {
        const response = new admin_user_response_dto_1.AdminUserResponseDto();
        response.id = user.id;
        response.email = user.email;
        response.firstName = user.firstName;
        response.lastName = user.lastName;
        response.role = user.role;
        response.status = user.status;
        response.createdAt = user.createdAt;
        response.lastLoginAt = user.lastLoginAt;
        const currentMonth = new Date().toISOString().slice(0, 7);
        const currentMonthUsage = user.monthlyUsage?.find((u) => u.monthYear === currentMonth);
        response.imagesGeneratedThisMonth = currentMonthUsage?.imagesGenerated || 0;
        response.templatesCount = await this.userService.getTemplatesCount(user.id);
        response.brandsCount = await this.userService.getBrandsCount(user.id);
        if (user.subscription) {
            response.subscription = {
                id: user.subscription.id,
                planId: user.subscription.planId,
                status: user.subscription.status,
                stripeSubscriptionId: user.subscription.stripeSubscriptionId,
                currentPeriodEnd: user.subscription.currentPeriodEnd,
                createdAt: user.subscription.createdAt,
                plan: {
                    id: user.subscription.plan.id,
                    name: user.subscription.plan.name,
                    priceMonthly: user.subscription.plan.priceMonthly,
                    imageLimitMonthly: user.subscription.plan.imageLimitMonthly,
                    storageLimitBytes: user.subscription.plan.storageLimitBytes,
                    templateLimit: user.subscription.plan.templateLimit,
                    brandLimit: user.subscription.plan.brandLimit,
                    teamMemberLimit: user.subscription.plan.teamMemberLimit,
                    integrationsIncluded: user.subscription.plan.integrationsIncluded,
                },
            };
        }
        if (user.storageUsage) {
            response.storageUsedMB =
                Math.round((user.storageUsage.bytesUsed / (1024 * 1024)) * 100) / 100;
            response.storageLimitMB = user.subscription?.plan
                ? Math.round((user.subscription.plan.storageLimitBytes / (1024 * 1024)) * 100) / 100
                : 0;
            response.storageUsagePercentage =
                response.storageLimitMB > 0
                    ? Math.round((response.storageUsedMB / response.storageLimitMB) * 100)
                    : 0;
        }
        else {
            response.storageUsedMB = 0;
            response.storageLimitMB = user.subscription?.plan
                ? Math.round((user.subscription.plan.storageLimitBytes / (1024 * 1024)) * 100) / 100
                : 0;
            response.storageUsagePercentage = 0;
        }
        if (user.storageUsage) {
            response.storageUsage = {
                bytesUsed: user.storageUsage.bytesUsed,
            };
        }
        response.monthlyUsage =
            user.monthlyUsage?.map((usage) => ({
                id: usage.id,
                monthYear: usage.monthYear,
                imagesGenerated: usage.imagesGenerated,
                imagesUploaded: usage.imagesUploaded,
            })) || [];
        return response;
    }
};
exports.AdminUserController = AdminUserController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all users (admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Users retrieved successfully.',
        type: [admin_user_response_dto_1.AdminUserResponseDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin access required.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user by ID (admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User retrieved successfully.',
        type: user_entity_1.User,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin access required.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new user (admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'User created successfully.',
        type: user_entity_1.User,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin access required.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'User already exists.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user by ID (admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User updated successfully.',
        type: user_entity_1.User,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin access required.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_update_user_dto_1.AdminUpdateUserDto]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user status (admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User status updated successfully.',
        type: user_entity_1.User,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin access required.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_status_dto_1.UpdateUserStatusDto]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete user by ID (admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'User deleted successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin access required.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/plan'),
    (0, swagger_1.ApiOperation)({ summary: 'Change user plan (admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User plan changed successfully.',
        type: admin_user_response_dto_1.AdminUserResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin access required.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, change_user_plan_dto_1.ChangeUserPlanDto]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "changeUserPlan", null);
exports.AdminUserController = AdminUserController = __decorate([
    (0, swagger_1.ApiTags)('admin/users'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, common_1.Controller)('admin/users'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], AdminUserController);
//# sourceMappingURL=admin-user.controller.js.map