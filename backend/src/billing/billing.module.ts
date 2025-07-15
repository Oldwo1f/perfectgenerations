import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';
import { Subscription } from './entities/subscription.entity';
import { UsageMonthly } from './entities/usage-monthly.entity';
import { UsageStorage } from './entities/usage-storage.entity';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';

@Module({
  imports: [TypeOrmModule.forFeature([Plan, Subscription, UsageMonthly, UsageStorage])],
  controllers: [PlanController, BillingController],
  providers: [PlanService, BillingService],
  exports: [TypeOrmModule, PlanService, BillingService],
})
export class BillingModule {}
