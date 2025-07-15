import { AuthService, AuthResponse } from './auth.service';
import { RegisterUserDto } from '../user/dto/register-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { UserService } from '../user/user.service';
interface AuthenticatedRequest extends Request {
    user: {
        sub: string;
        email: string;
        role: string;
        status: string;
    };
}
export declare class AuthController {
    private authService;
    private userService;
    constructor(authService: AuthService, userService: UserService);
    register(registerUserDto: RegisterUserDto): Promise<AuthResponse>;
    login(loginUserDto: LoginUserDto): Promise<AuthResponse>;
    adminLogin(loginUserDto: LoginUserDto): Promise<AuthResponse>;
    getProfile(req: AuthenticatedRequest): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        company: string;
        phone: string;
        role: import("../user/entities/user.entity").UserRole;
        status: import("../user/entities/user.entity").UserStatus;
        acceptNewsletter: boolean;
        isEmailVerified: boolean;
        isSubscriptionActive: boolean;
        monthlyImageLimit: number;
        imagesGeneratedThisMonth: number;
        createdAt: Date;
        lastLoginAt: Date;
    }>;
    refreshToken(req: AuthenticatedRequest): Promise<{
        access_token: string;
    }>;
    verifyEmail(body: {
        token: string;
    }): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
        };
    }>;
    forgotPassword(body: {
        email: string;
    }): Promise<{
        message: string;
    }>;
    resetPassword(body: {
        token: string;
        password: string;
    }): Promise<{
        message: string;
    }>;
    generateApiKey(req: AuthenticatedRequest): Promise<{
        apiKey: string;
    }>;
}
export {};
