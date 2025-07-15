"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../user/user.service");
let AuthService = class AuthService {
    constructor(userService, jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async register(registerUserDto) {
        const user = await this.userService.create(registerUserDto);
        if (process.env.NODE_ENV === 'development') {
            await this.userService.verifyEmail(user.emailVerificationToken);
        }
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const access_token = this.jwtService.sign(payload);
        return {
            access_token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName || undefined,
                lastName: user.lastName || undefined,
                role: user.role,
                status: user.status,
            },
        };
    }
    async login(loginUserDto) {
        const user = await this.userService.validateUser(loginUserDto);
        await this.userService.updateLastLogin(user.id);
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const access_token = this.jwtService.sign(payload);
        return {
            access_token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName || undefined,
                lastName: user.lastName || undefined,
                role: user.role,
                status: user.status,
            },
        };
    }
    async validateToken(token) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.userService.findById(payload.sub);
            if (!user) {
                throw new common_1.UnauthorizedException('Invalid token');
            }
            return user;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
    async refreshToken(userId) {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const access_token = this.jwtService.sign(payload);
        return { access_token };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map