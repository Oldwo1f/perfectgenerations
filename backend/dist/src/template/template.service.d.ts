import { Repository } from 'typeorm';
import { Template } from './entities/template.entity';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { Subscription } from '../billing/entities/subscription.entity';
import { Plan } from '../billing/entities/plan.entity';
export declare class TemplateService {
    private templateRepository;
    private subscriptionRepository;
    private planRepository;
    constructor(templateRepository: Repository<Template>, subscriptionRepository: Repository<Subscription>, planRepository: Repository<Plan>);
    private checkTemplateLimit;
    create(createTemplateDto: CreateTemplateDto & {
        userId: string;
    }): Promise<Template>;
    createExample(createTemplateDto: CreateTemplateDto): Promise<Template>;
    findAll(userId: string, category?: string): Promise<Template[]>;
    findAllWithExamples(userId?: string, category?: string): Promise<Template[]>;
    findExamples(category?: string): Promise<Template[]>;
    findOne(id: string): Promise<Template>;
    getTemplateContent(id: string): Promise<string>;
    update(id: string, updateTemplateDto: UpdateTemplateDto): Promise<Template>;
    remove(id: string): Promise<void>;
    findByCategory(category: string): Promise<Template[]>;
    findByName(name: string): Promise<Template>;
    findByNameForUser(name: string, userId: string): Promise<Template>;
}
