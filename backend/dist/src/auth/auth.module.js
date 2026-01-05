"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const user_module_1 = require("../user/user.module");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const api_key_guard_1 = require("./guards/api-key.guard");
const jwt_or_api_guard_1 = require("./guards/jwt-or-api.guard");
const validation_config_1 = require("../common/config/validation.config");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            user_module_1.UserModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: (0, validation_config_1.validateJwtSecret)(configService),
                    signOptions: { expiresIn: '24h' },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, jwt_auth_guard_1.JwtAuthGuard, api_key_guard_1.ApiKeyAuthGuard, jwt_or_api_guard_1.JwtOrApiKeyGuard],
        exports: [auth_service_1.AuthService, jwt_auth_guard_1.JwtAuthGuard, api_key_guard_1.ApiKeyAuthGuard, jwt_or_api_guard_1.JwtOrApiKeyGuard],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map