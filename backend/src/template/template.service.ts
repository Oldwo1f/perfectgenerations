import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, IsNull } from 'typeorm';
import { Template } from './entities/template.entity';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { Subscription, SubscriptionStatus } from '../billing/entities/subscription.entity';
import { Plan } from '../billing/entities/plan.entity';

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

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Template)
    private templateRepository: Repository<Template>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>,
  ) {}

  private async checkTemplateLimit(userId: string): Promise<void> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { user: { id: userId }, status: SubscriptionStatus.ACTIVE },
      relations: ['plan'],
    });

    if (!subscription) {
      throw new ForbiddenException(
        'Aucun abonnement actif trouvé. Veuillez souscrire à un plan pour créer des templates.',
      );
    }

    const plan = subscription.plan;

    if (plan.templateLimit === -1) {
      return; // Unlimited plan
    }

    const currentTemplateCount = await this.templateRepository.count({
      where: { userId },
    });

    if (currentTemplateCount >= plan.templateLimit) {
      throw new ForbiddenException(
        `Limite de templates atteinte. Votre plan ${plan.name} permet ${plan.templateLimit} template(s). ` +
          `Vous avez actuellement ${currentTemplateCount} template(s). ` +
          'Veuillez mettre à niveau votre plan pour créer plus de templates.',
      );
    }
  }

  async create(createTemplateDto: CreateTemplateDto & { userId: string }): Promise<Template> {
    // Check template limits before creating
    await this.checkTemplateLimit(createTemplateDto.userId);

    const template = this.templateRepository.create({
      ...createTemplateDto,
      html: createTemplateDto.html || defaultTemplateHtml,
    });
    return this.templateRepository.save(template);
  }

  async createExample(createTemplateDto: CreateTemplateDto): Promise<Template> {
    // Pour les templates d'exemple, pas de vérification de limite et pas de userId
    const template = this.templateRepository.create({
      ...createTemplateDto,
      userId: undefined, // Template d'exemple sans utilisateur associé
      html: createTemplateDto.html || defaultTemplateHtml,
    });
    return this.templateRepository.save(template);
  }

  async findAll(userId: string, category?: string): Promise<Template[]> {
    const where: FindOptionsWhere<Template> = { userId };
    if (category) {
      where.category = category;
    }
    return this.templateRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findAllWithExamples(userId?: string, category?: string): Promise<Template[]> {
    // Récupérer les templates de l'utilisateur
    const userTemplates = userId ? await this.findAll(userId, category) : [];

    // Récupérer les templates d'exemple (sans userId)
    const exampleWhere: FindOptionsWhere<Template> = { userId: IsNull() };
    if (category) {
      exampleWhere.category = category;
    }
    const exampleTemplates = await this.templateRepository.find({
      where: exampleWhere,
      order: { createdAt: 'DESC' },
    });

    // Combiner et retourner
    return [...userTemplates, ...exampleTemplates];
  }

  async findExamples(category?: string): Promise<Template[]> {
    const where: FindOptionsWhere<Template> = { userId: IsNull() };
    if (category) {
      where.category = category;
    }
    return this.templateRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Template> {
    const template = await this.templateRepository.findOne({ where: { id } });

    if (!template) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }

    return template;
  }

  async getTemplateContent(id: string): Promise<string> {
    const template = await this.findOne(id);
    return template.html;
  }

  async update(id: string, updateTemplateDto: UpdateTemplateDto): Promise<Template> {
    const template = await this.findOne(id);

    // Filtrer les propriétés qui ne devraient pas être modifiées
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = { ...updateTemplateDto };
    delete updateData.id;
    delete updateData.userId;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.brandVariables;

    Object.assign(template, updateData);
    return this.templateRepository.save(template);
  }

  async remove(id: string): Promise<void> {
    const template = await this.findOne(id);
    await this.templateRepository.remove(template);
  }

  async findByCategory(category: string): Promise<Template[]> {
    return this.templateRepository.find({
      where: { category },
    });
  }

  async findByName(name: string): Promise<Template> {
    const template = await this.templateRepository.findOne({ where: { name } });

    if (!template) {
      throw new NotFoundException(`Template with name "${name}" not found`);
    }

    return template;
  }

  async findByNameForUser(name: string, userId: string): Promise<Template> {
    const template = await this.templateRepository.findOne({ where: { name, userId } });
    if (!template) {
      throw new NotFoundException(`Template with name "${name}" not found for the current user`);
    }
    return template;
  }
}
