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
exports.TemplateService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const template_entity_1 = require("./entities/template.entity");
const subscription_entity_1 = require("../billing/entities/subscription.entity");
const plan_entity_1 = require("../billing/entities/plan.entity");
const defaultTemplateHtml = `<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8" />
		<link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web/css/phosphor.css">
		<style>
		</style>
	</head>
	<body>
		<div
			class="background"
			style="background-image: url('{{resolveImage mainImageUrl}}')"
		><i class="ph ph-heart"></i></div>
		<div class="content">
			<div class="main-title">{{title}}</div>
			<div class="subtitle">{{subtitle}}</div>
		</div>
	</body>
</html>`;
let TemplateService = class TemplateService {
    constructor(templateRepository, subscriptionRepository, planRepository) {
        this.templateRepository = templateRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.planRepository = planRepository;
    }
    async checkTemplateLimit(userId) {
        const subscription = await this.subscriptionRepository.findOne({
            where: { user: { id: userId }, status: subscription_entity_1.SubscriptionStatus.ACTIVE },
            relations: ['plan'],
        });
        if (!subscription) {
            throw new common_1.ForbiddenException('Aucun abonnement actif trouvé. Veuillez souscrire à un plan pour créer des templates.');
        }
        const plan = subscription.plan;
        if (plan.templateLimit === -1) {
            return;
        }
        const currentTemplateCount = await this.templateRepository.count({
            where: { userId },
        });
        if (currentTemplateCount >= plan.templateLimit) {
            throw new common_1.ForbiddenException(`Limite de templates atteinte. Votre plan ${plan.name} permet ${plan.templateLimit} template(s). ` +
                `Vous avez actuellement ${currentTemplateCount} template(s). ` +
                'Veuillez mettre à niveau votre plan pour créer plus de templates.');
        }
    }
    async create(createTemplateDto) {
        await this.checkTemplateLimit(createTemplateDto.userId);
        const template = this.templateRepository.create({
            ...createTemplateDto,
            html: createTemplateDto.html || defaultTemplateHtml,
        });
        return this.templateRepository.save(template);
    }
    async createExample(createTemplateDto) {
        const template = this.templateRepository.create({
            ...createTemplateDto,
            userId: undefined,
            html: createTemplateDto.html || defaultTemplateHtml,
        });
        return this.templateRepository.save(template);
    }
    async findAll(userId, category) {
        const where = { userId };
        if (category) {
            where.category = category;
        }
        return this.templateRepository.find({
            where,
            order: { createdAt: 'DESC' },
        });
    }
    async findAllWithExamples(userId, category) {
        const userTemplates = userId ? await this.findAll(userId, category) : [];
        const exampleWhere = { userId: (0, typeorm_2.IsNull)() };
        if (category) {
            exampleWhere.category = category;
        }
        const exampleTemplates = await this.templateRepository.find({
            where: exampleWhere,
            order: { createdAt: 'DESC' },
        });
        return [...userTemplates, ...exampleTemplates];
    }
    async findExamples(category) {
        const where = { userId: (0, typeorm_2.IsNull)() };
        if (category) {
            where.category = category;
        }
        return this.templateRepository.find({
            where,
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const template = await this.templateRepository.findOne({ where: { id } });
        if (!template) {
            throw new common_1.NotFoundException(`Template with ID ${id} not found`);
        }
        return template;
    }
    async getTemplateContent(id) {
        const template = await this.findOne(id);
        return template.html;
    }
    async update(id, updateTemplateDto) {
        const template = await this.findOne(id);
        const updateData = { ...updateTemplateDto };
        delete updateData.id;
        delete updateData.userId;
        delete updateData.createdAt;
        delete updateData.updatedAt;
        delete updateData.brandVariables;
        Object.assign(template, updateData);
        return this.templateRepository.save(template);
    }
    async remove(id) {
        const template = await this.findOne(id);
        await this.templateRepository.remove(template);
    }
    async findByCategory(category) {
        return this.templateRepository.find({
            where: { category },
        });
    }
    async findByName(name) {
        const template = await this.templateRepository.findOne({ where: { name } });
        if (!template) {
            throw new common_1.NotFoundException(`Template with name "${name}" not found`);
        }
        return template;
    }
    async findByNameForUser(name, userId) {
        const template = await this.templateRepository.findOne({ where: { name, userId } });
        if (!template) {
            throw new common_1.NotFoundException(`Template with name "${name}" not found for the current user`);
        }
        return template;
    }
};
exports.TemplateService = TemplateService;
exports.TemplateService = TemplateService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(template_entity_1.Template)),
    __param(1, (0, typeorm_1.InjectRepository)(subscription_entity_1.Subscription)),
    __param(2, (0, typeorm_1.InjectRepository)(plan_entity_1.Plan)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TemplateService);
//# sourceMappingURL=template.service.js.map