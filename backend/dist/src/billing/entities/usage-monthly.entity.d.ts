import { User } from '../../user/entities/user.entity';
export declare class UsageMonthly {
    id: string;
    userId: string;
    user: User;
    monthYear: string;
    imagesGenerated: number;
    imagesUploaded: number;
}
