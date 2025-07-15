import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Subscription, SubscriptionStatus } from '../billing/entities/subscription.entity';
import { Plan } from '../billing/entities/plan.entity';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>,
  ) {}

  async findAll(): Promise<Brand[]> {
    return this.brandRepository.find();
  }

  async findAllByUser(userId: string): Promise<Brand[]> {
    return this.brandRepository.find({ where: { userId } });
  }

  async findOne(id: string): Promise<Brand> {
    const brand = await this.brandRepository.findOne({ where: { id } });
    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }
    return brand;
  }

  async findOneByUser(id: string, userId: string): Promise<Brand> {
    const brand = await this.brandRepository.findOne({ where: { id, userId } });
    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }
    return brand;
  }

  async create(createBrandDto: CreateBrandDto & { userId: string }): Promise<Brand> {
    await this.checkBrandLimit(createBrandDto.userId);

    const newBrand = this.brandRepository.create({
      ...createBrandDto,
      imageGroups: createBrandDto.imageGroups.map((group) => ({
        groupName: group.groupName,
        images_url: group.images_url.map((img) => img.url),
      })),
    });
    return this.brandRepository.save(newBrand);
  }

  async update(id: string, brand: Partial<Brand>): Promise<Brand> {
    const existingBrand = await this.findOne(id);
    const updatedBrand = this.brandRepository.merge(existingBrand, brand);
    return this.brandRepository.save(updatedBrand);
  }

  async updateByUser(id: string, updateBrandDto: UpdateBrandDto, userId: string): Promise<Brand> {
    const existingBrand = await this.findOneByUser(id, userId);

    // Filtrer les propriétés qui ne devraient pas être modifiées
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = { ...updateBrandDto };
    delete updateData.id;
    delete updateData.userId;

    if (updateBrandDto.imageGroups) {
      updateData.imageGroups = updateBrandDto.imageGroups.map((group) => ({
        groupName: group.groupName,
        images_url: group.images_url.map((img) => img.url),
      }));
    }

    const updatedBrand = this.brandRepository.merge(existingBrand, updateData);
    return this.brandRepository.save(updatedBrand);
  }

  async remove(id: string): Promise<void> {
    const result = await this.brandRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }
  }

  async removeByUser(id: string, userId: string): Promise<void> {
    const result = await this.brandRepository.delete({ id, userId });
    if (result.affected === 0) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }
  }

  async findByName(name: string): Promise<Brand> {
    const brand = await this.brandRepository.findOne({ where: { name } });
    if (!brand) {
      throw new NotFoundException(`Brand with name "${name}" not found`);
    }
    return brand;
  }

  async findByNameForUser(name: string, userId: string): Promise<Brand> {
    const brand = await this.brandRepository.findOne({ where: { name, userId } });
    if (!brand) {
      throw new NotFoundException(`Brand with name "${name}" not found for the current user`);
    }
    return brand;
  }

  private async checkBrandLimit(userId: string): Promise<void> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { user: { id: userId }, status: SubscriptionStatus.ACTIVE },
      relations: ['plan'],
    });

    if (!subscription) {
      throw new ForbiddenException(
        'Aucun abonnement actif trouvé. Veuillez souscrire à un plan pour créer des marques.',
      );
    }

    const plan = subscription.plan;

    if (plan.brandLimit === -1) {
      return;
    }

    const currentBrandCount = await this.brandRepository.count({
      where: { userId },
    });

    if (currentBrandCount >= plan.brandLimit) {
      throw new ForbiddenException(
        `Limite de marques atteinte. Votre plan ${plan.name} permet ${plan.brandLimit} marque(s). ` +
          `Vous avez actuellement ${currentBrandCount} marque(s). ` +
          'Veuillez mettre à niveau votre plan pour créer plus de marques.',
      );
    }
  }
}
