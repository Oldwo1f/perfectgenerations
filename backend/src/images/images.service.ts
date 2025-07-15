import {
  Injectable,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Image } from './entities/image.entity';
import { User } from '../user/entities/user.entity';
import { Subscription } from '../billing/entities/subscription.entity';
import { UsageStorage } from '../billing/entities/usage-storage.entity';
import { SubscriptionStatus } from '../billing/entities/subscription.entity';
import * as fs from 'fs/promises';
import { join } from 'path';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(UsageStorage)
    private readonly usageStorageRepository: Repository<UsageStorage>,
    private readonly entityManager: EntityManager,
  ) {}

  async findAll(userId: string): Promise<Image[]> {
    return this.imageRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async create(image: Omit<Image, 'id' | 'user' | 'createdAt'>, user: User): Promise<Image> {
    // Check for active subscription or use default limits for new users
    const subscription = await this.subscriptionRepository.findOne({
      where: { userId: user.id, status: SubscriptionStatus.ACTIVE },
      relations: ['plan'],
    });

    let plan;
    if (!subscription) {
      // For new users without subscription, use default limits
      plan = {
        storageLimitBytes: 100 * 1024 * 1024, // 100MB default
        name: 'Free Plan',
      };
    } else {
      plan = subscription.plan;
    }

    const newImageSize = image.size;

    // Check storage limits before proceeding
    const currentUsage = await this.usageStorageRepository.findOne({
      where: { userId: user.id },
    });

    const currentBytesUsed = currentUsage ? Number(currentUsage.bytesUsed) : 0;

    if (
      plan.storageLimitBytes !== -1 && // -1 for unlimited
      currentBytesUsed + newImageSize > plan.storageLimitBytes
    ) {
      // Delete the physically uploaded file before throwing error
      const filePath = join(process.cwd(), 'uploads', 'images', image.filename);
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.error(`Failed to delete orphaned file: ${filePath}`, error);
      }
      throw new ForbiddenException('Storage limit exceeded.');
    }

    // Create the image
    const newImage = this.imageRepository.create({
      ...image,
      user: { id: user.id }, // Pass only the user ID, not the full user object
    });

    const savedImage = await this.imageRepository.save(newImage);

    // Update storage usage
    if (currentUsage) {
      currentUsage.bytesUsed = Number(currentUsage.bytesUsed) + newImageSize;
      await this.usageStorageRepository.save(currentUsage);
    } else {
      throw new InternalServerErrorException('Usage storage record not found for user');
    }

    return savedImage;
  }

  async findOne(id: string, userId: string): Promise<Image | null> {
    return this.imageRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['user'],
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    const image = await this.findOne(id, userId);
    if (!image) {
      throw new NotFoundException('Image not found');
    }

    // Delete the image
    await this.imageRepository.delete(id);

    // Update storage usage
    const storageUsage = await this.usageStorageRepository.findOne({
      where: { userId },
    });

    if (storageUsage) {
      storageUsage.bytesUsed = Math.max(0, Number(storageUsage.bytesUsed) - image.size);
      await this.usageStorageRepository.save(storageUsage);
    } else {
      // Log warning but don't throw error for deletion
      console.warn('No usage storage record found for user during deletion');
    }

    // Delete the physical file
    const filePath = join(process.cwd(), 'uploads', 'images', image.filename);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error(`Failed to delete file: ${filePath}`, error);
      throw new InternalServerErrorException('Failed to delete file asset.');
    }
  }
}
