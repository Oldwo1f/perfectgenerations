import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { User } from '../user/entities/user.entity';
import { Image } from '../images/entities/image.entity';
import { Brand } from '../brand/entities/brand.entity';
import { Template } from '../template/entities/template.entity';
import { UsageMonthly } from '../billing/entities/usage-monthly.entity';
import { BillingModule } from '../billing/billing.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Image, Brand, Template, UsageMonthly]), BillingModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
