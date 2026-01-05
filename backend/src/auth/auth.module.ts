import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '../user/user.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiKeyAuthGuard } from './guards/api-key.guard';
import { JwtOrApiKeyGuard } from './guards/jwt-or-api.guard';
import { validateJwtSecret } from '../common/config/validation.config';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: validateJwtSecret(configService),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, ApiKeyAuthGuard, JwtOrApiKeyGuard],
  exports: [AuthService, JwtAuthGuard, ApiKeyAuthGuard, JwtOrApiKeyGuard],
})
export class AuthModule {}
