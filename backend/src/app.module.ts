import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandModule } from './brand/brand.module';
import { TemplateModule } from './template/template.module';
import { GenerateModule } from './generate/generate.module';
import { ImagesModule } from './images/images.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { BillingModule } from './billing/billing.module';
import { Brand } from './brand/entities/brand.entity';
import { Template } from './template/entities/template.entity';
import { Image } from './images/entities/image.entity';
import { User } from './user/entities/user.entity';
import { Plan } from './billing/entities/plan.entity';
import { Subscription } from './billing/entities/subscription.entity';
import { UsageMonthly } from './billing/entities/usage-monthly.entity';
import { UsageStorage } from './billing/entities/usage-storage.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'perfectgenerations',
      entities: [Brand, Template, Image, User, Plan, Subscription, UsageMonthly, UsageStorage],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    BrandModule,
    TemplateModule,
    GenerateModule,
    ImagesModule,
    UserModule,
    AuthModule,
    DashboardModule,
    BillingModule,
  ],
})
export class AppModule {}
