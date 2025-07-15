import { BrandService } from './brand.service';
import { Brand } from './entities/brand.entity';
import { User } from '../user/entities/user.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
export declare class BrandController {
    private readonly brandService;
    constructor(brandService: BrandService);
    create(createBrandDto: CreateBrandDto, user: User): Promise<Brand>;
    findAll(user: User): Promise<Brand[]>;
    findOne(id: string, user: User): Promise<Brand>;
    update(id: string, updateBrandDto: UpdateBrandDto, user: User): Promise<Brand>;
    remove(id: string, user: User): Promise<void>;
}
