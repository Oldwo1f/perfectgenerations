import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
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
export declare class BillingService {
    private readonly subscriptionRepository;
    private readonly usageStorageRepository;
    private readonly planRepository;
    private readonly usageMonthlyRepository;
    constructor(subscriptionRepository: Repository<Subscription>, usageStorageRepository: Repository<UsageStorage>, planRepository: Repository<Plan>, usageMonthlyRepository: Repository<UsageMonthly>);
    getStorageInfo(userId: string): Promise<StorageInfo>;
    incrementImagesGenerated(userId: string): Promise<void>;
    getImageUsageInfo(userId: string): Promise<ImageUsageInfo>;
}
