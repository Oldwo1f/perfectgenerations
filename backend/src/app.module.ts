import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { BrandModule } from './brand/brand.module';
import { TemplateModule } from './template/template.module';
import { GenerateModule } from './generate/generate.module';
import { ImagesModule } from './images/images.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { BillingModule } from './billing/billing.module';
import { HealthModule } from './health/health.module';
import { LoggerModule } from './common/logger/logger.module';
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
    LoggerModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          ttl: 60, // 60 secondes
          limit: 100, // 100 requêtes par minute
          // Utilise le storage mémoire par défaut
          // Note: Pour utiliser Redis, il faudrait créer un storage personnalisé
          // Le storage mémoire fonctionne très bien pour la plupart des cas
        };
      },
      inject: [ConfigService],
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
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
