import { ImagesService } from './images.service';
import { Image } from './entities/image.entity';
import { User } from '../user/entities/user.entity';
export declare class ImagesController {
    private readonly imagesService;
    constructor(imagesService: ImagesService);
    findAll(user: User): Promise<Image[]>;
    uploadImage(file: Express.Multer.File, user: User): Promise<Image>;
    deleteImage(id: string, user: User): Promise<{
        success: boolean;
    }>;
}
