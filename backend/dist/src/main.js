"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const path_1 = require("path");
const helmet_1 = require("helmet");
const logger_service_1 = require("./common/logger/logger.service");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: false,
    });
    const logger = app.get(logger_service_1.LoggerService);
    app.useLogger(logger);
    app.use((0, helmet_1.default)());
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter(logger));
    app.setGlobalPrefix('api');
    const corsOrigins = process.env.CORS_ORIGINS
        ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim())
        : process.env.NODE_ENV !== 'production'
            ? true
            : [];
    app.enableCors({
        origin: corsOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
        credentials: true,
    });
    const uploadsPath = (0, path_1.join)(__dirname, '..', '..', 'uploads');
    logger.log(`Static uploads path: ${uploadsPath}`, 'Bootstrap');
    app.useStaticAssets(uploadsPath, {
        prefix: '/uploads/',
    });
    const assetsPath = (0, path_1.join)(__dirname, '..', '..', 'assets');
    logger.log(`Static assets path: ${assetsPath}`, 'Bootstrap');
    app.useStaticAssets(assetsPath, {
        prefix: '/assets/',
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    const enableSwagger = process.env.ENABLE_SWAGGER === 'true' || process.env.NODE_ENV !== 'production';
    if (enableSwagger) {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('Perfect Generations API')
            .setDescription("API pour la génération d'images parfaites pour votre marque")
            .setVersion('1.0')
            .addBearerAuth()
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api', app, document);
    }
    const port = parseInt(process.env.PORT || '3001', 10);
    await app.listen(port);
    logger.log(`Application is running on: http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
//# sourceMappingURL=main.js.map