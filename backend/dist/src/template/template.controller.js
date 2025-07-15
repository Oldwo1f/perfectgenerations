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
exports.TemplateController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const template_service_1 = require("./template.service");
const template_entity_1 = require("./entities/template.entity");
const create_template_dto_1 = require("./dto/create-template.dto");
const update_template_dto_1 = require("./dto/update-template.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const user_entity_1 = require("../user/entities/user.entity");
const fs = require("fs");
const path = require("path");
let TemplateController = class TemplateController {
    constructor(templateService) {
        this.templateService = templateService;
    }
    async create(createTemplateDto, user) {
        return this.templateService.create({
            ...createTemplateDto,
            userId: user.id,
        });
    }
    async createExample(createTemplateDto) {
        return this.templateService.createExample(createTemplateDto);
    }
    async findAll(user, category) {
        return this.templateService.findAll(user.id, category);
    }
    async findExamples(category) {
        return this.templateService.findExamples(category);
    }
    async findAllWithExamples(user, category) {
        return this.templateService.findAllWithExamples(user.id, category);
    }
    async findOne(id) {
        return this.templateService.findOne(id);
    }
    async getTemplateContent(id) {
        return this.templateService.getTemplateContent(id);
    }
    async update(id, updateTemplateDto) {
        return this.templateService.update(id, updateTemplateDto);
    }
    async remove(id) {
        return this.templateService.remove(id);
    }
    async getPreviewImage(filename, res) {
        const previewPath = path.join(__dirname, '../assets/templatePreviews', filename);
        if (!fs.existsSync(previewPath)) {
            res.status(404).json({ message: 'Preview image not found' });
            return;
        }
        res.sendFile(previewPath);
    }
};
exports.TemplateController = TemplateController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new template' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Template created successfully',
        type: template_entity_1.Template,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_template_dto_1.CreateTemplateDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], TemplateController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('example'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new example template (public)' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Example template created successfully',
        type: template_entity_1.Template,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_template_dto_1.CreateTemplateDto]),
    __metadata("design:returntype", Promise)
], TemplateController.prototype, "createExample", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get all templates for the current user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all templates', type: [template_entity_1.Template] }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], TemplateController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('examples'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all example templates (public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all example templates', type: [template_entity_1.Template] }),
    __param(0, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TemplateController.prototype, "findExamples", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get all templates (user + examples) for the current user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all templates with examples', type: [template_entity_1.Template] }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], TemplateController.prototype, "findAllWithExamples", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a template by id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the template', type: template_entity_1.Template }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TemplateController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/content'),
    (0, swagger_1.ApiOperation)({ summary: 'Get template HTML content' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the template HTML content' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TemplateController.prototype, "getTemplateContent", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a template' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Template updated successfully',
        type: template_entity_1.Template,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_template_dto_1.UpdateTemplateDto]),
    __metadata("design:returntype", Promise)
], TemplateController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a template' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Template deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TemplateController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('preview/:filename'),
    (0, swagger_1.ApiOperation)({ summary: 'Get template preview image' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the preview image' }),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TemplateController.prototype, "getPreviewImage", null);
exports.TemplateController = TemplateController = __decorate([
    (0, swagger_1.ApiTags)('templates'),
    (0, common_1.Controller)('templates'),
    __metadata("design:paramtypes", [template_service_1.TemplateService])
], TemplateController);
//# sourceMappingURL=template.controller.js.map