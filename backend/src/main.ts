import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Set global prefix for all routes
  app.setGlobalPrefix('api');

  // Configuration CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3002'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Servir les fichiers statiques (images uploadées)
  console.log('Static uploads path:', join(__dirname, '..', '..', 'uploads'));
  app.useStaticAssets(join(__dirname, '..', '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Servir les assets d'icônes (CSS, polices, etc.)
  console.log('Static assets path:', join(__dirname, '..', '..', 'assets'));
  app.useStaticAssets(join(__dirname, '..', '..', 'assets'), {
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

  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('Perfect Generations API')
    .setDescription("API pour la génération d'images parfaites pour votre marque")
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Démarrage du serveur
  const port = 3001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
