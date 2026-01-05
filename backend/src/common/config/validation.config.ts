import { ConfigService } from '@nestjs/config';

export function validateJwtSecret(configService: ConfigService): string {
  const jwtSecret = configService.get<string>('JWT_SECRET');
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');

  if (!jwtSecret) {
    if (nodeEnv === 'production') {
      throw new Error(
        'JWT_SECRET is required in production environment. Please set JWT_SECRET environment variable.',
      );
    }
    console.warn(
      '⚠️  WARNING: JWT_SECRET is not set. Using fallback secret. This is insecure for production!',
    );
    return 'fallback-secret';
  }

  if (jwtSecret.length < 32) {
    throw new Error(
      `JWT_SECRET must be at least 32 characters long. Current length: ${jwtSecret.length}`,
    );
  }

  return jwtSecret;
}

