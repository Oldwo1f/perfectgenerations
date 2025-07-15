import { Subscription } from '../../billing/entities/subscription.entity';
import { UsageMonthly } from '../../billing/entities/usage-monthly.entity';
import { UsageStorage } from '../../billing/entities/usage-storage.entity';
import { Image } from '../../images/entities/image.entity';
import { Brand } from '../../brand/entities/brand.entity';
import { Template } from '../../template/entities/template.entity';
export declare enum UserRole {
    USER = "user",
    ADMIN = "admin"
}
export declare enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended",
    PENDING_VERIFICATION = "pending_verification"
}
export declare class User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    company: string;
    phone: string;
    acceptNewsletter: boolean;
    role: UserRole;
    status: UserStatus;
    emailVerificationToken: string | null;
    emailVerifiedAt: Date | null;
    passwordResetToken: string | null;
    passwordResetExpires: Date | null;
    lastLoginAt: Date;
    subscriptionEndsAt: Date;
    imagesGeneratedThisMonth: number;
    monthlyUsageResetAt: Date;
    subscription: Subscription;
    monthlyUsage: UsageMonthly[];
    storageUsage: UsageStorage;
    images: Image[];
    brands: Brand[];
    templates: Template[];
    apiKey: string;
    isApiOnly: boolean;
    createdAt: Date;
    updatedAt: Date;
    hashPassword(): Promise<void>;
    validatePassword(password: string): Promise<boolean>;
    getFullName(): string;
    isEmailVerified(): boolean;
    isSubscriptionActive(): boolean;
    getMonthlyImageLimit(): number;
    canGenerateImage(): boolean;
    resetMonthlyUsage(): void;
}
