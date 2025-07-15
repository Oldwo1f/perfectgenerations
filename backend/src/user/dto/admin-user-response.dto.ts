import { ApiProperty } from '@nestjs/swagger';
import { UserRole, UserStatus } from '../entities/user.entity';
import { SubscriptionStatus } from '../../billing/entities/subscription.entity';

export class PlanInfoDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  priceMonthly: number;

  @ApiProperty()
  imageLimitMonthly: number;

  @ApiProperty()
  storageLimitBytes: number;

  @ApiProperty()
  templateLimit: number;

  @ApiProperty()
  brandLimit: number;

  @ApiProperty()
  teamMemberLimit: number;

  @ApiProperty()
  integrationsIncluded: boolean;
}

export class SubscriptionInfoDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  planId: string;

  @ApiProperty({ enum: SubscriptionStatus })
  status: SubscriptionStatus;

  @ApiProperty({ required: false })
  stripeSubscriptionId?: string;

  @ApiProperty({ required: false })
  currentPeriodEnd?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: PlanInfoDto })
  plan: PlanInfoDto;
}

export class UsageStorageDto {
  @ApiProperty()
  bytesUsed: number;
}

export class UsageMonthlyDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  monthYear: string;

  @ApiProperty()
  imagesGenerated: number;

  @ApiProperty()
  imagesUploaded: number;
}

export class AdminUserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false })
  firstName?: string;

  @ApiProperty({ required: false })
  lastName?: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty({ enum: UserStatus })
  status: UserStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false })
  lastLoginAt?: Date;

  @ApiProperty()
  imagesGeneratedThisMonth: number;

  @ApiProperty({ type: SubscriptionInfoDto, required: false })
  subscription?: SubscriptionInfoDto;

  @ApiProperty({ type: UsageStorageDto, required: false })
  storageUsage?: UsageStorageDto;

  @ApiProperty({ type: [UsageMonthlyDto] })
  monthlyUsage: UsageMonthlyDto[];

  @ApiProperty()
  storageUsedMB: number;

  @ApiProperty()
  storageLimitMB: number;

  @ApiProperty()
  storageUsagePercentage: number;

  @ApiProperty()
  templatesCount: number;

  @ApiProperty()
  brandsCount: number;

  // Computed properties
  @ApiProperty()
  get fullName(): string {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim() || 'N/A';
  }

  @ApiProperty()
  get isSubscriptionActive(): boolean {
    if (this.role === UserRole.ADMIN) return true;
    if (!this.subscription || !this.subscription.currentPeriodEnd) return false;
    return new Date() < this.subscription.currentPeriodEnd;
  }

  @ApiProperty()
  get monthlyImageLimit(): number {
    if (this.role === UserRole.ADMIN) return 999999;
    return this.subscription?.plan?.imageLimitMonthly || 10;
  }

  @ApiProperty()
  get currentMonthImagesGenerated(): number {
    if (!this.monthlyUsage || this.monthlyUsage.length === 0) return 0;
    const currentMonth = new Date().toISOString().slice(0, 7); // Format: 'YYYY-MM'
    const usage = this.monthlyUsage.find((u) => u.monthYear === currentMonth);
    return usage ? usage.imagesGenerated : 0;
  }

  @ApiProperty()
  get canGenerateImage(): boolean {
    return this.imagesGeneratedThisMonth < this.monthlyImageLimit;
  }
}
