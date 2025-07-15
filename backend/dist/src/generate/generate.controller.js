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
exports.GenerateController = void 0;
const common_1 = require("@nestjs/common");
const generate_service_1 = require("./generate.service");
const swagger_1 = require("@nestjs/swagger");
const generate_image_dto_1 = require("./dto/generate-image.dto");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const user_entity_1 = require("../user/entities/user.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let GenerateController = class GenerateController {
    constructor(generateService) {
        this.generateService = generateService;
    }
    async generateImage(data, res, user) {
        try {
            const buffer = await this.generateService.generateImageFromDatabase({
                templateName: data.templateName,
                brandName: data.brandName,
                templateVariables: data.templateVariables,
            }, user);
            res.set({
                'Content-Type': 'image/png',
                'Content-Length': buffer.length,
            });
            res.send(buffer);
        }
        catch (error) {
            res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message,
            });
        }
    }
};
exports.GenerateController = GenerateController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Generate an image from template and brand names' }),
    (0, swagger_1.ApiBody)({ type: generate_image_dto_1.GenerateImageDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Image generated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generate_image_dto_1.GenerateImageDto, Object, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], GenerateController.prototype, "generateImage", null);
exports.GenerateController = GenerateController = __decorate([
    (0, swagger_1.ApiTags)('generate'),
    (0, common_1.Controller)('generate'),
    __metadata("design:paramtypes", [generate_service_1.GenerateService])
], GenerateController);
//# sourceMappingURL=generate.controller.js.map