import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../user/user.service';
interface AuthenticatedRequest extends Request {
    user?: {
        sub: string;
        email: string;
        role: string;
        status: string;
        isApiKey?: boolean;
    };
}
export declare class ApiKeyAuthMiddleware implements NestMiddleware {
    private userService;
    constructor(userService: UserService);
    use(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
}
export {};
