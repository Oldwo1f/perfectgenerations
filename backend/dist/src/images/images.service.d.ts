import { Repository, EntityManager } from 'typeorm';
import { Image } from './entities/image.entity';
import { User } from '../user/entities/user.entity';
import { Subscription } from '../billing/entities/subscription.entity';
import { UsageStorage } from '../billing/entities/usage-storage.entity';
export declare class ImagesService {
    private readonly imageRepository;
    private readonly subscriptionRepository;
    private readonly usageStorageRepository;
    private readonly entityManager;
    constructor(imageRepository: Repository<Image>, subscriptionRepository: Repository<Subscription>, usageStorageRepository: Repository<UsageStorage>, entityManager: EntityManager);
    findAll(userId: string): Promise<Image[]>;
    create(image: Omit<Image, 'id' | 'user' | 'createdAt'>, user: User): Promise<Image>;
    findOne(id: string, userId: string): Promise<Image | null>;
    delete(id: string, userId: string): Promise<void>;
}
