import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Image } from '../images/entities/image.entity';
import { Brand } from '../brand/entities/brand.entity';
import { Template } from '../template/entities/template.entity';
import { UsageMonthly } from '../billing/entities/usage-monthly.entity';
import { BillingService, StorageInfo, ImageUsageInfo } from '../billing/billing.service';

export interface UserStats {
  imagesGenerated: number;
  imagesUploaded: number;
  brandsCreated: number;
  templatesUsed: number;
  storageInfo: StorageInfo;
  imageUsageInfo: ImageUsageInfo;
}

export interface UserActivity {
  id: string;
  title: string;
  description: string;
  icon: string;
  createdAt: string;
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(Template)
    private readonly templateRepository: Repository<Template>,
    @InjectRepository(UsageMonthly)
    private readonly usageMonthlyRepository: Repository<UsageMonthly>,
    private readonly billingService: BillingService,
  ) {}

  async getStats(userId: string): Promise<UserStats> {
    const currentMonth = new Date().toISOString().slice(0, 7); // Format: 'YYYY-MM'

    const [imagesCount, brandsCount, templatesCount, usageMonthly, storageInfo, imageUsageInfo] =
      await Promise.all([
        this.imageRepository.count({ where: { user: { id: userId } } }),
        this.brandRepository.count({ where: { user: { id: userId } } }),
        this.templateRepository.count({ where: { user: { id: userId } } }),
        this.usageMonthlyRepository.findOne({
          where: { userId, monthYear: currentMonth },
        }),
        this.billingService.getStorageInfo(userId),
        this.billingService.getImageUsageInfo(userId),
      ]);

    return {
      imagesGenerated: usageMonthly?.imagesGenerated || 0,
      imagesUploaded: imagesCount,
      brandsCreated: brandsCount,
      templatesUsed: templatesCount,
      storageInfo,
      imageUsageInfo,
    };
  }

  async getActivity(userId: string): Promise<UserActivity[]> {
    // Get recent images
    const recentImages = await this.imageRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      take: 5,
    });

    // Get recent brands (no createdAt field, use current date)
    const recentBrands = await this.brandRepository.find({
      where: { user: { id: userId } },
      take: 5,
    });

    // Get recent templates
    const recentTemplates = await this.templateRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      take: 5,
    });

    // Combine and sort all activities
    const activities: UserActivity[] = [
      ...recentImages.map((img) => ({
        id: img.id,
        title: 'Image uploadée',
        description: `Nouvelle image: ${img.originalName}`,
        icon: 'ph-duotone ph-image',
        createdAt: img.createdAt.toISOString(),
      })),
      ...recentBrands.map((brand) => ({
        id: brand.id,
        title: 'Marque créée',
        description: `Nouvelle marque: ${brand.name}`,
        icon: 'ph-duotone ph-palette',
        createdAt: new Date().toISOString(), // Use current date since Brand has no createdAt
      })),
      ...recentTemplates.map((template) => ({
        id: template.id,
        title: 'Template créé',
        description: `Nouveau template: ${template.name}`,
        icon: 'ph-duotone ph-file-text',
        createdAt: template.createdAt.toISOString(),
      })),
    ];

    // Sort by creation date (newest first) and take the 10 most recent
    return activities
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  }
}
