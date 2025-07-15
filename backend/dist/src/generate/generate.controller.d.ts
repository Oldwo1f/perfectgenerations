import { Response } from 'express';
import { GenerateService } from './generate.service';
import { GenerateImageDto } from './dto/generate-image.dto';
import { User } from '../user/entities/user.entity';
export declare class GenerateController {
    private readonly generateService;
    constructor(generateService: GenerateService);
    generateImage(data: GenerateImageDto, res: Response, user: User): Promise<void>;
}
