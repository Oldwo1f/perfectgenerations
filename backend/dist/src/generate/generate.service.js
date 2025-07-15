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
exports.GenerateService = void 0;
const common_1 = require("@nestjs/common");
const puppeteer = require("puppeteer");
const Handlebars = require("handlebars");
const handlebarsHelpers_1 = require("../utils/handlebarsHelpers");
const htmlUtils_1 = require("../utils/htmlUtils");
const template_service_1 = require("../template/template.service");
const brand_service_1 = require("../brand/brand.service");
const typeorm_1 = require("@nestjs/typeorm");
const subscription_entity_1 = require("../billing/entities/subscription.entity");
const typeorm_2 = require("typeorm");
const usage_monthly_entity_1 = require("../billing/entities/usage-monthly.entity");
let GenerateService = class GenerateService {
    constructor(templateService, brandService, subscriptionRepository, usageMonthlyRepository) {
        this.templateService = templateService;
        this.brandService = brandService;
        this.subscriptionRepository = subscriptionRepository;
        this.usageMonthlyRepository = usageMonthlyRepository;
    }
    async generateImage(html, data, width, height, googleFontsLinks) {
        if (!html) {
            throw new common_1.InternalServerErrorException('HTML content is required');
        }
        (0, handlebarsHelpers_1.registerHandlebarsHelpers)();
        const template = Handlebars.compile(html);
        const content = template(data);
        const browser = await puppeteer.launch({
            headless: 'new',
            args: [
                `--window-size=${width},${height}`,
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-web-security',
            ],
        });
        try {
            const page = await browser.newPage();
            await page.setBypassCSP(true);
            await page.setDefaultNavigationTimeout(30000);
            await page.setDefaultTimeout(30000);
            page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
            page.on('requestfailed', (request) => {
                console.log('REQUEST FAILED:', request.url(), request.failure());
            });
            page.on('response', (response) => {
                if (response.status() >= 400) {
                    console.log('RESPONSE ERROR:', response.url(), response.status());
                }
            });
            await page.setViewport({ width, height });
            const fullHtml = (0, htmlUtils_1.addGoogleFontsAndStyles)(content, googleFontsLinks);
            await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
            const screenshot = await page.screenshot({ type: 'png', fullPage: true });
            return Buffer.from(screenshot);
        }
        finally {
            await browser.close();
        }
    }
    async generateImageFromDatabase(data, user) {
        const subscription = await this.subscriptionRepository.findOne({
            where: { user: { id: user.id }, status: subscription_entity_1.SubscriptionStatus.ACTIVE },
            relations: ['plan'],
        });
        if (!subscription) {
            throw new common_1.ForbiddenException('No active subscription found.');
        }
        const plan = subscription.plan;
        if (plan.imageLimitMonthly === -1) {
        }
        else {
            const today = new Date();
            const monthYear = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
            let monthlyUsage = await this.usageMonthlyRepository.findOne({
                where: {
                    user: { id: user.id },
                    monthYear: monthYear,
                },
            });
            if (!monthlyUsage) {
                monthlyUsage = this.usageMonthlyRepository.create({
                    user,
                    monthYear: monthYear,
                    imagesGenerated: 0,
                });
            }
            if (plan.imageLimitMonthly !== 0 && monthlyUsage.imagesGenerated >= plan.imageLimitMonthly) {
                throw new common_1.ForbiddenException('Monthly generation limit reached.');
            }
            monthlyUsage.imagesGenerated += 1;
            await this.usageMonthlyRepository.save(monthlyUsage);
        }
        try {
            const template = await this.templateService.findByNameForUser(data.templateName, user.id);
            const dbBrand = await this.brandService.findByNameForUser(data.brandName, user.id);
            const width = template.layout?.width || 1024;
            const height = template.layout?.height || 1024;
            const googleFontsLinks = this.generateGoogleFontsLinks(dbBrand);
            const imageGroupsByName = (dbBrand.imageGroups || []).reduce((acc, group) => {
                if (group.groupName) {
                    acc[group.groupName] = group.images_url || [];
                }
                return acc;
            }, {});
            const templateBrand = {
                ...dbBrand,
                imageGroups: imageGroupsByName,
            };
            const templateData = {
                ...data.templateVariables,
                brand: templateBrand,
            };
            return await this.generateImage(template.html, templateData, width, height, googleFontsLinks);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Failed to generate image: ${error.message}`);
        }
    }
    generateGoogleFontsLinks(brand) {
        const fonts = new Set();
        if (brand.titleFont)
            fonts.add(brand.titleFont);
        if (brand.textFont)
            fonts.add(brand.textFont);
        if (brand.tertiaryFont)
            fonts.add(brand.tertiaryFont);
        if (fonts.size === 0)
            return '';
        const fontFamilies = Array.from(fonts)
            .map((font) => font.replace(/\s+/g, '+'))
            .join('&family=');
        return `https://fonts.googleapis.com/css2?family=${fontFamilies}:wght@400;700&display=swap`;
    }
};
exports.GenerateService = GenerateService;
exports.GenerateService = GenerateService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(subscription_entity_1.Subscription)),
    __param(3, (0, typeorm_1.InjectRepository)(usage_monthly_entity_1.UsageMonthly)),
    __metadata("design:paramtypes", [template_service_1.TemplateService,
        brand_service_1.BrandService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], GenerateService);
//# sourceMappingURL=generate.service.js.map