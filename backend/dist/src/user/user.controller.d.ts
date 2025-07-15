import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from './entities/user.entity';
interface AuthenticatedRequest extends Request {
    user: User;
}
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getProfile(req: AuthenticatedRequest): Omit<User, 'password' | 'hashPassword' | 'validatePassword' | 'getFullName' | 'isEmailVerified' | 'isSubscriptionActive' | 'getMonthlyImageLimit' | 'getMonthlyApiLimit' | 'canGenerateImage' | 'canMakeApiCall' | 'resetMonthlyUsage' | 'subscription' | 'plan'>;
    updateProfile(req: AuthenticatedRequest, updateUserDto: UpdateUserDto): Promise<User>;
    changePassword(req: AuthenticatedRequest, changePasswordDto: ChangePasswordDto): Promise<void>;
    deleteAccount(req: AuthenticatedRequest): Promise<void>;
}
export {};
