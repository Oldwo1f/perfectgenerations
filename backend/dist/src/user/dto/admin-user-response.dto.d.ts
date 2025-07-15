import { UserRole, UserStatus } from '../entities/user.entity';
import { SubscriptionStatus } from '../../billing/entities/subscription.entity';
export declare class PlanInfoDto {
    id: string;
    name: string;
    priceMonthly: number;
    imageLimitMonthly: number;
    storageLimitBytes: number;
    templateLimit: number;
    brandLimit: number;
    teamMemberLimit: number;
    integrationsIncluded: boolean;
}
export declare class SubscriptionInfoDto {
    id: string;
    planId: string;
    status: SubscriptionStatus;
    stripeSubscriptionId?: string;
    currentPeriodEnd?: Date;
    createdAt: Date;
    plan: PlanInfoDto;
}
export declare class UsageStorageDto {
    bytesUsed: number;
}
export declare class UsageMonthlyDto {
    id: string;
    monthYear: string;
    imagesGenerated: number;
    imagesUploaded: number;
}
export declare class AdminUserResponseDto {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: UserRole;
    status: UserStatus;
    createdAt: Date;
    lastLoginAt?: Date;
    imagesGeneratedThisMonth: number;
    subscription?: SubscriptionInfoDto;
    storageUsage?: UsageStorageDto;
    monthlyUsage: UsageMonthlyDto[];
    storageUsedMB: number;
    storageLimitMB: number;
    storageUsagePercentage: number;
    templatesCount: number;
    brandsCount: number;
    get fullName(): string;
    get isSubscriptionActive(): boolean;
    get monthlyImageLimit(): number;
    get currentMonthImagesGenerated(): number;
    get canGenerateImage(): boolean;
}
