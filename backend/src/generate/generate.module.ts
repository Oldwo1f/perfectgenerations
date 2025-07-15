import { Module } from '@nestjs/common';
import { GenerateController } from './generate.controller';
import { GenerateService } from './generate.service';
import { TemplateModule } from '../template/template.module';
import { BrandModule } from '../brand/brand.module';
import { UserModule } from '../user/user.module';
import { BillingModule } from '../billing/billing.module';

@Module({
  imports: [TemplateModule, BrandModule, UserModule, BillingModule],
  controllers: [GenerateController],
  providers: [GenerateService],
})
export class GenerateModule {}
