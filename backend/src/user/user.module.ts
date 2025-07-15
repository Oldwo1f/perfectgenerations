import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { BillingModule } from '../billing/billing.module';
import { UserController } from './user.controller';
import { AdminUserController } from './admin-user.controller';
import { Image } from '../images/entities/image.entity';
import { Brand } from '../brand/entities/brand.entity';
import { Template } from '../template/entities/template.entity';
import { Subscription } from '../billing/entities/subscription.entity';
import { UsageMonthly } from '../billing/entities/usage-monthly.entity';
import { UsageStorage } from '../billing/entities/usage-storage.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Subscription,
      UsageMonthly,
      UsageStorage,
      Image,
      Brand,
      Template,
    ]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'fallback-secret',
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
    BillingModule,
  ],
  controllers: [UserController, AdminUserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
