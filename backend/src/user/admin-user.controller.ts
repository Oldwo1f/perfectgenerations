import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { AdminUserResponseDto } from './dto/admin-user-response.dto';
import { ChangeUserPlanDto } from './dto/change-user-plan.dto';

@ApiTags('admin/users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin/users')
export class AdminUserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully.',
    type: [AdminUserResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required.' })
  async findAll(): Promise<AdminUserResponseDto[]> {
    const users = await this.userService.findAll();
    const responses = await Promise.all(users.map((user) => this.transformToAdminResponse(user)));
    return responses;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully.',
    type: User,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOne(@Param('id') id: string): Promise<Partial<User>> {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user (admin only)' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully.',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required.' })
  @ApiResponse({ status: 409, description: 'User already exists.' })
  async create(@Body() createUserDto: CreateUserDto): Promise<Partial<User>> {
    const user = await this.userService.create(createUserDto);
    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user by ID (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully.',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: AdminUpdateUserDto,
  ): Promise<Partial<User>> {
    const user = await this.userService.adminUpdate(id, updateUserDto);
    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update user status (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'User status updated successfully.',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateUserStatusDto,
  ): Promise<Partial<User>> {
    const user = await this.userService.updateStatus(id, updateStatusDto.status);
    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user by ID (admin only)' })
  @ApiResponse({ status: 204, description: 'User deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.userService.delete(id);
  }

  @Patch(':id/plan')
  @ApiOperation({ summary: 'Change user plan (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'User plan changed successfully.',
    type: AdminUserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async changeUserPlan(
    @Param('id') id: string,
    @Body() changeUserPlanDto: ChangeUserPlanDto,
  ): Promise<AdminUserResponseDto> {
    const user = await this.userService.changeUserPlan(id, changeUserPlanDto.planId);
    return await this.transformToAdminResponse(user);
  }

  private async transformToAdminResponse(user: User): Promise<AdminUserResponseDto> {
    const response = new AdminUserResponseDto();

    // Basic user info
    response.id = user.id;
    response.email = user.email;
    response.firstName = user.firstName;
    response.lastName = user.lastName;
    response.role = user.role;
    response.status = user.status;
    response.createdAt = user.createdAt;
    response.lastLoginAt = user.lastLoginAt;
    // Calculer imagesGeneratedThisMonth à partir du mois courant
    const currentMonth = new Date().toISOString().slice(0, 7); // Format: 'YYYY-MM'
    const currentMonthUsage = user.monthlyUsage?.find((u) => u.monthYear === currentMonth);
    response.imagesGeneratedThisMonth = currentMonthUsage?.imagesGenerated || 0;

    // Compter les templates et marques
    response.templatesCount = await this.userService.getTemplatesCount(user.id);
    response.brandsCount = await this.userService.getBrandsCount(user.id);

    // Subscription info
    if (user.subscription) {
      response.subscription = {
        id: user.subscription.id,
        planId: user.subscription.planId,
        status: user.subscription.status,
        stripeSubscriptionId: user.subscription.stripeSubscriptionId,
        currentPeriodEnd: user.subscription.currentPeriodEnd,
        createdAt: user.subscription.createdAt,
        plan: {
          id: user.subscription.plan.id,
          name: user.subscription.plan.name,
          priceMonthly: user.subscription.plan.priceMonthly,
          imageLimitMonthly: user.subscription.plan.imageLimitMonthly,
          storageLimitBytes: user.subscription.plan.storageLimitBytes,
          templateLimit: user.subscription.plan.templateLimit,
          brandLimit: user.subscription.plan.brandLimit,
          teamMemberLimit: user.subscription.plan.teamMemberLimit,
          integrationsIncluded: user.subscription.plan.integrationsIncluded,
        },
      };
    }

    // Calculer les propriétés de stockage
    if (user.storageUsage) {
      response.storageUsedMB =
        Math.round((user.storageUsage.bytesUsed / (1024 * 1024)) * 100) / 100;
      response.storageLimitMB = user.subscription?.plan
        ? Math.round((user.subscription.plan.storageLimitBytes / (1024 * 1024)) * 100) / 100
        : 0;
      response.storageUsagePercentage =
        response.storageLimitMB > 0
          ? Math.round((response.storageUsedMB / response.storageLimitMB) * 100)
          : 0;
    } else {
      response.storageUsedMB = 0;
      response.storageLimitMB = user.subscription?.plan
        ? Math.round((user.subscription.plan.storageLimitBytes / (1024 * 1024)) * 100) / 100
        : 0;
      response.storageUsagePercentage = 0;
    }

    // Storage usage
    if (user.storageUsage) {
      response.storageUsage = {
        bytesUsed: user.storageUsage.bytesUsed,
      };
    }

    // Monthly usage
    response.monthlyUsage =
      user.monthlyUsage?.map((usage) => ({
        id: usage.id,
        monthYear: usage.monthYear,
        imagesGenerated: usage.imagesGenerated,
        imagesUploaded: usage.imagesUploaded,
      })) || [];

    return response;
  }
}
