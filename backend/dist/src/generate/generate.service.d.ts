import { TemplateService } from '../template/template.service';
import { BrandService } from '../brand/brand.service';
import { User } from '../user/entities/user.entity';
import { Subscription } from '../billing/entities/subscription.entity';
import { Repository } from 'typeorm';
import { UsageMonthly } from '../billing/entities/usage-monthly.entity';
interface GenerateImageData {
    [key: string]: unknown;
}
interface GenerateFromDatabaseData {
    templateName: string;
    brandName: string;
    templateVariables?: Record<string, unknown>;
}
export declare class GenerateService {
    private readonly templateService;
    private readonly brandService;
    private readonly subscriptionRepository;
    private readonly usageMonthlyRepository;
    constructor(templateService: TemplateService, brandService: BrandService, subscriptionRepository: Repository<Subscription>, usageMonthlyRepository: Repository<UsageMonthly>);
    generateImage(html: string, data: GenerateImageData, width: number, height: number, googleFontsLinks: string): Promise<Buffer>;
    generateImageFromDatabase(data: GenerateFromDatabaseData, user: User): Promise<Buffer>;
    private generateGoogleFontsLinks;
}
export {};
