import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
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

@Injectable()
export class ApiKeyAuthMiddleware implements NestMiddleware {
  constructor(private userService: UserService) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
      return next();
    }

    try {
      const user = await this.userService.findByApiKey(apiKey);

      if (!user) {
        throw new UnauthorizedException('Invalid API key');
      }

      if (user.status !== 'active') {
        throw new UnauthorizedException('User account is not active');
      }

      // Attach user to request
      req.user = {
        sub: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        isApiKey: true,
      };

      // Increment API usage - This will be handled by the billing service later
      // await this.userService.incrementApiUsage(user.id);

      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid API key');
    }
  }
}
