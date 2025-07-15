import { UserRole, UserStatus } from '../entities/user.entity';
export declare class AdminUpdateUserDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: UserRole;
    status?: UserStatus;
}
