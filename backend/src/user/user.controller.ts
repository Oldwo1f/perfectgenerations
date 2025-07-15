import {
  Controller,
  Get,
  Body,
  Patch,
  Req,
  UseGuards,
  Post,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';

interface AuthenticatedRequest extends Request {
  user: User;
}

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: "Get current user's profile" })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully.',
    type: User,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getProfile(
    @Req() req: AuthenticatedRequest,
  ): Omit<
    User,
    | 'password'
    | 'hashPassword'
    | 'validatePassword'
    | 'getFullName'
    | 'isEmailVerified'
    | 'isSubscriptionActive'
    | 'getMonthlyImageLimit'
    | 'getMonthlyApiLimit'
    | 'canGenerateImage'
    | 'canMakeApiCall'
    | 'resetMonthlyUsage'
    | 'subscription'
    | 'plan'
  > {
    // We remove password and methods from the user object before returning it
    const { password, ...user } = req.user;
    return user;
  }

  @Patch('me')
  @ApiOperation({ summary: "Update current user's profile" })
  @ApiResponse({ status: 200, description: 'Profile updated successfully.', type: User })
  updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(req.user.id, updateUserDto);
  }

  @Post('me/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Change current user's password" })
  @ApiResponse({ status: 204, description: 'Password changed successfully.' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request (e.g., wrong password).',
  })
  async changePassword(
    @Req() req: AuthenticatedRequest,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    await this.userService.changePassword(
      req.user.id,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
  }

  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete current user's account" })
  @ApiResponse({ status: 204, description: 'Account deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async deleteAccount(@Req() req: AuthenticatedRequest): Promise<void> {
    await this.userService.delete(req.user.id);
  }
}
