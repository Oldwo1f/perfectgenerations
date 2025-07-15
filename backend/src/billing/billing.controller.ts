import { Controller, Get, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('storage-info')
  @UseGuards(JwtAuthGuard)
  async getStorageInfo(@CurrentUser() user: User) {
    return this.billingService.getStorageInfo(user.id);
  }
}
