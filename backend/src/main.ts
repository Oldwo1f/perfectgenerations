import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { LoggerService } from './common/logger/logger.service';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: false, // Désactiver le logger par défaut pour utiliser Winston
  });
  const logger = app.get(LoggerService);
  app.useLogger(logger);

  // Headers de sécurité
  app.use(helmet());

  // Exception filter global
  app.useGlobalFilters(new HttpExceptionFilter(logger));

  // Set global prefix for all routes
  app.setGlobalPrefix('api');

  // Configuration CORS
  const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim())
    : process.env.NODE_ENV !== 'production'
      ? true // reflect request origin in dev
      : [];

  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
    credentials: true,
  });

  // Servir les fichiers statiques (images uploadées)
  const uploadsPath = join(__dirname, '..', '..', 'uploads');
  logger.log(`Static uploads path: ${uploadsPath}`, 'Bootstrap');
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
  });

  // Servir les assets d'icônes (CSS, polices, etc.)
  const assetsPath = join(__dirname, '..', '..', 'assets');
  logger.log(`Static assets path: ${assetsPath}`, 'Bootstrap');
  app.useStaticAssets(assetsPath, {
    prefix: '/assets/',
  });

  // Configuration de la validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Configuration Swagger (désactivé en production)
  const enableSwagger =
    process.env.ENABLE_SWAGGER === 'true' || process.env.NODE_ENV !== 'production';
  if (enableSwagger) {
    const config = new DocumentBuilder()
      .setTitle('Perfect Generations API')
      .setDescription("API pour la génération d'images parfaites pour votre marque")
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  // Démarrage du serveur
  const port = parseInt(process.env.PORT || '3001', 10);
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`, 'Bootstrap');
}

bootstrap();
