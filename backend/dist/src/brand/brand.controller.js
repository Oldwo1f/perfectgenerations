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
exports.BrandController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const brand_service_1 = require("./brand.service");
const brand_entity_1 = require("./entities/brand.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const user_entity_1 = require("../user/entities/user.entity");
const create_brand_dto_1 = require("./dto/create-brand.dto");
const update_brand_dto_1 = require("./dto/update-brand.dto");
let BrandController = class BrandController {
    constructor(brandService) {
        this.brandService = brandService;
    }
    async create(createBrandDto, user) {
        return this.brandService.create({
            ...createBrandDto,
            userId: user.id,
        });
    }
    async findAll(user) {
        return this.brandService.findAllByUser(user.id);
    }
    async findOne(id, user) {
        return this.brandService.findOneByUser(id, user.id);
    }
    async update(id, updateBrandDto, user) {
        return this.brandService.updateByUser(id, updateBrandDto, user.id);
    }
    async remove(id, user) {
        return this.brandService.removeByUser(id, user.id);
    }
};
exports.BrandController = BrandController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new brand' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Brand created successfully',
        type: brand_entity_1.Brand,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_brand_dto_1.CreateBrandDto, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], BrandController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all brands for current user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all brands', type: [brand_entity_1.Brand] }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], BrandController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a brand by id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the brand', type: brand_entity_1.Brand }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], BrandController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a brand' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Brand updated successfully',
        type: brand_entity_1.Brand,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_brand_dto_1.UpdateBrandDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], BrandController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a brand' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Brand deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], BrandController.prototype, "remove", null);
exports.BrandController = BrandController = __decorate([
    (0, swagger_1.ApiTags)('brands'),
    (0, common_1.Controller)('brands'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [brand_service_1.BrandService])
], BrandController);
//# sourceMappingURL=brand.controller.js.map