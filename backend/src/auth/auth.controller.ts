import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService, AuthResponse } from './auth.service';
import { RegisterUserDto } from '../user/dto/register-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserService } from '../user/user.service';

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    email: string;
    role: string;
    status: string;
  };
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            role: { type: 'string' },
            status: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() registerUserDto: RegisterUserDto): Promise<AuthResponse> {
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            role: { type: 'string' },
            status: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  async login(@Body() loginUserDto: LoginUserDto): Promise<AuthResponse> {
    return this.authService.login(loginUserDto);
  }

  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin login' })
  @ApiResponse({
    status: 200,
    description: 'Admin logged in successfully',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            role: { type: 'string' },
            status: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  @ApiResponse({ status: 403, description: 'Access denied - Admin rights required' })
  async adminLogin(@Body() loginUserDto: LoginUserDto): Promise<AuthResponse> {
    const result = await this.authService.login(loginUserDto);

    // Vérifier que l'utilisateur a les droits admin
    if (result.user.role !== 'admin' && result.user.role !== 'super_admin') {
      throw new BadRequestException('Access denied. Admin rights required.');
    }

    return result;
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req: AuthenticatedRequest) {
    const user = await this.userService.findById(req.user.sub);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      company: user.company,
      phone: user.phone,
      role: user.role,
      status: user.status,
      acceptNewsletter: user.acceptNewsletter,
      isEmailVerified: user.isEmailVerified(),
      isSubscriptionActive: user.isSubscriptionActive(),
      monthlyImageLimit: user.getMonthlyImageLimit(),
      imagesGeneratedThisMonth:
        user.monthlyUsage?.find((u) => u.monthYear === new Date().toISOString().slice(0, 7))
          ?.imagesGenerated || 0,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    };
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async refreshToken(@Request() req: AuthenticatedRequest) {
    return this.authService.refreshToken(req.user.sub);
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Verify email address' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid verification token' })
  async verifyEmail(@Body() body: { token: string }) {
    const user = await this.userService.verifyEmail(body.token);
    return { message: 'Email verified successfully', user: { id: user.id, email: user.email } };
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  async forgotPassword(@Body() body: { email: string }) {
    await this.userService.requestPasswordReset(body.email);
    return {
      message: 'If an account with that email exists, a password reset link has been sent.',
    };
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired reset token' })
  async resetPassword(@Body() body: { token: string; password: string }) {
    await this.userService.resetPassword(body.token, body.password);
    return { message: 'Password reset successfully' };
  }

  @Post('generate-api-key')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate API key for user' })
  @ApiResponse({
    status: 200,
    description: 'API key generated successfully',
    schema: {
      type: 'object',
      properties: {
        apiKey: { type: 'string' },
      },
    },
  })
  async generateApiKey(@Request() req: AuthenticatedRequest) {
    const apiKey = await this.userService.generateApiKey(req.user.sub);
    return { apiKey };
  }
}
