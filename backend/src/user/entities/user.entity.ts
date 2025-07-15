import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcryptjs';
import { Subscription } from '../../billing/entities/subscription.entity';
import { UsageMonthly } from '../../billing/entities/usage-monthly.entity';
import { UsageStorage } from '../../billing/entities/usage-storage.entity';
import { Image } from '../../images/entities/image.entity';
import { Brand } from '../../brand/entities/brand.entity';
import { Template } from '../../template/entities/template.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  company: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: false })
  acceptNewsletter: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING_VERIFICATION,
  })
  status: UserStatus;

  @Column({ nullable: true, type: 'varchar' })
  emailVerificationToken: string | null;

  @Column({ nullable: true, type: 'timestamp' })
  emailVerifiedAt: Date | null;

  @Column({ nullable: true, type: 'varchar' })
  passwordResetToken: string | null;

  @Column({ nullable: true, type: 'timestamp' })
  passwordResetExpires: Date | null;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @Column({ nullable: true })
  subscriptionEndsAt: Date;

  @Column({ default: 0 })
  imagesGeneratedThisMonth: number;

  @Column({ type: 'timestamp', nullable: true })
  monthlyUsageResetAt: Date;

  @OneToOne(() => Subscription, (subscription) => subscription.user)
  subscription: Subscription;

  @OneToMany(() => UsageMonthly, (usage) => usage.user)
  monthlyUsage: UsageMonthly[];

  @OneToOne(() => UsageStorage, (usage) => usage.user)
  storageUsage: UsageStorage;

  @OneToMany(() => Image, (image) => image.user)
  images: Image[];

  @OneToMany(() => Brand, (brand) => brand.user)
  brands: Brand[];

  @OneToMany(() => Template, (template) => template.user)
  templates: Template[];

  @Column({ nullable: true })
  apiKey: string;

  @Column({ default: false })
  isApiOnly: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password && this.password.length < 60) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  getFullName(): string {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim();
  }

  isEmailVerified(): boolean {
    return !!this.emailVerifiedAt;
  }

  isSubscriptionActive(): boolean {
    if (this.role === UserRole.ADMIN) return true;
    if (!this.subscription || !this.subscription.currentPeriodEnd) return false;
    return new Date() < this.subscription.currentPeriodEnd;
  }

  getMonthlyImageLimit(): number {
    switch (this.role) {
      case UserRole.USER:
        return 10;
      case UserRole.ADMIN:
        return 999999;
      default:
        return 10;
    }
  }

  canGenerateImage(): boolean {
    return this.imagesGeneratedThisMonth < this.getMonthlyImageLimit();
  }

  resetMonthlyUsage(): void {
    this.imagesGeneratedThisMonth = 0;
    this.monthlyUsageResetAt = new Date();
  }
}
