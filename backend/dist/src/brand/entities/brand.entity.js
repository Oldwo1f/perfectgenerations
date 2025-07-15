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
exports.Brand = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../user/entities/user.entity");
let Brand = class Brand {
};
exports.Brand = Brand;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Brand.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Brand.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Brand.prototype, "primaryColor", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Brand.prototype, "secondaryColor", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Brand.prototype, "tertiaryColor", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Brand.prototype, "titleFont", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Brand.prototype, "textFont", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Brand.prototype, "tertiaryFont", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Brand.prototype, "logoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { default: [] }),
    (0, swagger_1.ApiProperty)({ type: [Object] }),
    __metadata("design:type", Array)
], Brand.prototype, "backgrounds", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { default: [] }),
    (0, swagger_1.ApiProperty)({ type: [Object] }),
    __metadata("design:type", Array)
], Brand.prototype, "icons", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { default: [] }),
    (0, swagger_1.ApiProperty)({ type: [Object] }),
    __metadata("design:type", Array)
], Brand.prototype, "imageGroups", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '#000000' }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Brand.prototype, "textColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '#000000' }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Brand.prototype, "textColor2", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Brand.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.brands),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Brand.prototype, "user", void 0);
exports.Brand = Brand = __decorate([
    (0, typeorm_1.Entity)()
], Brand);
//# sourceMappingURL=brand.entity.js.map