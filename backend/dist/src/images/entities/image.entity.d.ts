import { User } from '../../user/entities/user.entity';
export declare class Image {
    id: string;
    filename: string;
    originalName: string;
    size: number;
    url: string;
    user: User;
    createdAt: Date;
}
