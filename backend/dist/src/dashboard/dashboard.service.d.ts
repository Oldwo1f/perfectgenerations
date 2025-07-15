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
export declare class DashboardService {
    private readonly userRepository;
    private readonly imageRepository;
    private readonly brandRepository;
    private readonly templateRepository;
    private readonly usageMonthlyRepository;
    private readonly billingService;
    constructor(userRepository: Repository<User>, imageRepository: Repository<Image>, brandRepository: Repository<Brand>, templateRepository: Repository<Template>, usageMonthlyRepository: Repository<UsageMonthly>, billingService: BillingService);
    getStats(userId: string): Promise<UserStats>;
    getActivity(userId: string): Promise<UserActivity[]>;
}
