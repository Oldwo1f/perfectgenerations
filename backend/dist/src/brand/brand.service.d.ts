import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Subscription } from '../billing/entities/subscription.entity';
import { Plan } from '../billing/entities/plan.entity';
export declare class BrandService {
    private brandRepository;
    private subscriptionRepository;
    private planRepository;
    constructor(brandRepository: Repository<Brand>, subscriptionRepository: Repository<Subscription>, planRepository: Repository<Plan>);
    findAll(): Promise<Brand[]>;
    findAllByUser(userId: string): Promise<Brand[]>;
    findOne(id: string): Promise<Brand>;
    findOneByUser(id: string, userId: string): Promise<Brand>;
    create(createBrandDto: CreateBrandDto & {
        userId: string;
    }): Promise<Brand>;
    update(id: string, brand: Partial<Brand>): Promise<Brand>;
    updateByUser(id: string, updateBrandDto: UpdateBrandDto, userId: string): Promise<Brand>;
    remove(id: string): Promise<void>;
    removeByUser(id: string, userId: string): Promise<void>;
    findByName(name: string): Promise<Brand>;
    findByNameForUser(name: string, userId: string): Promise<Brand>;
    private checkBrandLimit;
}
