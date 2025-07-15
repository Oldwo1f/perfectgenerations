import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription, SubscriptionStatus } from './entities/subscription.entity';
import { UsageStorage } from './entities/usage-storage.entity';
import { Plan } from './entities/plan.entity';
import { UsageMonthly } from './entities/usage-monthly.entity';

export interface StorageInfo {
  planName: string;
  storageLimitBytes: number;
  bytesUsed: number;
  bytesAvailable: number;
  usagePercentage: number;
  isUnlimited: boolean;
}

export interface ImageUsageInfo {
  planName: string;
  imagesGenerated: number;
  imageLimitMonthly: number;
  usagePercentage: number;
  isUnlimited: boolean;
}

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(UsageStorage)
    private readonly usageStorageRepository: Repository<UsageStorage>,
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
    @InjectRepository(UsageMonthly)
    private readonly usageMonthlyRepository: Repository<UsageMonthly>,
  ) {}

  async getStorageInfo(userId: string): Promise<StorageInfo> {
    // Get user's active subscription
    const subscription = await this.subscriptionRepository.findOne({
      where: { userId, status: SubscriptionStatus.ACTIVE },
      relations: ['plan'],
    });

    // Get current storage usage
    const usageStorage = await this.usageStorageRepository.findOne({
      where: { userId },
    });

    const bytesUsed = usageStorage ? Number(usageStorage.bytesUsed) : 0;

    // If no subscription, use free plan defaults
    if (!subscription) {
      const freePlan = await this.planRepository.findOne({
        where: { id: 'free' },
      });

      const storageLimitBytes = freePlan ? Number(freePlan.storageLimitBytes) : 100 * 1024 * 1024; // 100MB default
      const bytesAvailable = storageLimitBytes - bytesUsed;
      const usagePercentage = storageLimitBytes > 0 ? (bytesUsed / storageLimitBytes) * 100 : 0;

      return {
        planName: 'Free',
        storageLimitBytes,
        bytesUsed,
        bytesAvailable,
        usagePercentage,
        isUnlimited: false,
      };
    }

    // User has a subscription
    const plan = subscription.plan;
    const storageLimitBytes = Number(plan.storageLimitBytes);
    const isUnlimited = storageLimitBytes === -1;

    const bytesAvailable = isUnlimited ? -1 : storageLimitBytes - bytesUsed;
    const usagePercentage = isUnlimited
      ? 0
      : storageLimitBytes > 0
        ? (bytesUsed / storageLimitBytes) * 100
        : 0;

    return {
      planName: plan.name,
      storageLimitBytes,
      bytesUsed,
      bytesAvailable,
      usagePercentage,
      isUnlimited,
    };
  }

  async incrementImagesGenerated(userId: string): Promise<void> {
    const currentMonth = new Date().toISOString().slice(0, 7); // Format: 'YYYY-MM'

    let usageMonthly = await this.usageMonthlyRepository.findOne({
      where: { userId, monthYear: currentMonth },
    });

    if (!usageMonthly) {
      usageMonthly = this.usageMonthlyRepository.create({
        userId,
        monthYear: currentMonth,
        imagesGenerated: 0,
        imagesUploaded: 0,
      });
    }

    usageMonthly.imagesGenerated += 1;
    await this.usageMonthlyRepository.save(usageMonthly);
  }

  async getImageUsageInfo(userId: string): Promise<ImageUsageInfo> {
    const currentMonth = new Date().toISOString().slice(0, 7); // Format: 'YYYY-MM'

    // Get user's active subscription
    const subscription = await this.subscriptionRepository.findOne({
      where: { userId, status: SubscriptionStatus.ACTIVE },
      relations: ['plan'],
    });

    // Get current monthly usage
    const usageMonthly = await this.usageMonthlyRepository.findOne({
      where: { userId, monthYear: currentMonth },
    });

    const imagesGenerated = usageMonthly?.imagesGenerated || 0;

    // If no subscription, use free plan defaults
    if (!subscription) {
      const freePlan = await this.planRepository.findOne({
        where: { id: 'free' },
      });

      const imageLimitMonthly = freePlan ? freePlan.imageLimitMonthly : 50;
      const isUnlimited = imageLimitMonthly === -1;
      const usagePercentage = isUnlimited
        ? 0
        : imageLimitMonthly > 0
          ? (imagesGenerated / imageLimitMonthly) * 100
          : 0;

      return {
        planName: 'Free',
        imagesGenerated,
        imageLimitMonthly,
        usagePercentage,
        isUnlimited,
      };
    }

    // User has a subscription
    const plan = subscription.plan;
    const imageLimitMonthly = plan.imageLimitMonthly;
    const isUnlimited = imageLimitMonthly === -1;

    const usagePercentage = isUnlimited
      ? 0
      : imageLimitMonthly > 0
        ? (imagesGenerated / imageLimitMonthly) * 100
        : 0;

    return {
      planName: plan.name,
      imagesGenerated,
      imageLimitMonthly,
      usagePercentage,
      isUnlimited,
    };
  }
}
