import { Response } from 'express';
import { TemplateService } from './template.service';
import { Template } from './entities/template.entity';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { User } from '../user/entities/user.entity';
export declare class TemplateController {
    private readonly templateService;
    constructor(templateService: TemplateService);
    create(createTemplateDto: CreateTemplateDto, user: User): Promise<Template>;
    createExample(createTemplateDto: CreateTemplateDto): Promise<Template>;
    findAll(user: User, category?: string): Promise<Template[]>;
    findExamples(category?: string): Promise<Template[]>;
    findAllWithExamples(user: User, category?: string): Promise<Template[]>;
    findOne(id: string): Promise<Template>;
    getTemplateContent(id: string): Promise<string>;
    update(id: string, updateTemplateDto: UpdateTemplateDto): Promise<Template>;
    remove(id: string): Promise<void>;
    getPreviewImage(filename: string, res: Response): Promise<void>;
}
