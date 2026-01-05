"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateJwtSecret = validateJwtSecret;
function validateJwtSecret(configService) {
    const jwtSecret = configService.get('JWT_SECRET');
    const nodeEnv = configService.get('NODE_ENV', 'development');
    if (!jwtSecret) {
        if (nodeEnv === 'production') {
            throw new Error('JWT_SECRET is required in production environment. Please set JWT_SECRET environment variable.');
        }
        console.warn('⚠️  WARNING: JWT_SECRET is not set. Using fallback secret. This is insecure for production!');
        return 'fallback-secret';
    }
    if (jwtSecret.length < 32) {
        throw new Error(`JWT_SECRET must be at least 32 characters long. Current length: ${jwtSecret.length}`);
    }
    return jwtSecret;
}
//# sourceMappingURL=validation.config.js.map