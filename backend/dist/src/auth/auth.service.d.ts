import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterUserDto } from '../user/dto/register-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { User } from '../user/entities/user.entity';
export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
}
export interface AuthResponse {
    access_token: string;
    user: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
        role: string;
        status: string;
    };
}
export declare class AuthService {
    private userService;
    private jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    register(registerUserDto: RegisterUserDto): Promise<AuthResponse>;
    login(loginUserDto: LoginUserDto): Promise<AuthResponse>;
    validateToken(token: string): Promise<User>;
    refreshToken(userId: string): Promise<{
        access_token: string;
    }>;
}
