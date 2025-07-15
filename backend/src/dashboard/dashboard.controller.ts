import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getStats(@CurrentUser() user: User) {
    return this.dashboardService.getStats(user.id);
  }

  @Get('activity')
  @UseGuards(JwtAuthGuard)
  async getActivity(@CurrentUser() user: User) {
    return this.dashboardService.getActivity(user.id);
  }
}
