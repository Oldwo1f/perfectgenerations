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
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const logger_service_1 = require("../logger/logger.service");
let HttpExceptionFilter = class HttpExceptionFilter {
    constructor(logger) {
        this.logger = logger;
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception instanceof common_1.HttpException
            ? exception.getResponse()
            : 'Internal server error';
        const isProduction = process.env.NODE_ENV === 'production';
        const errorDetails = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message: typeof message === 'string' ? message : message.message || message,
        };
        if (status >= 500) {
            this.logger.error(`${request.method} ${request.url} - ${status}`, exception instanceof Error ? exception.stack : String(exception), 'HttpExceptionFilter');
        }
        else {
            this.logger.warn(`${request.method} ${request.url} - ${status}: ${errorDetails.message}`, 'HttpExceptionFilter');
        }
        const responseBody = {
            statusCode: status,
            timestamp: errorDetails.timestamp,
            path: request.url,
        };
        if (typeof message === 'string') {
            responseBody.message = message;
        }
        else if (typeof message === 'object') {
            responseBody.message = message.message || 'An error occurred';
            if (Array.isArray(message.message)) {
                responseBody.message = message.message;
            }
            if (!isProduction && message.error) {
                responseBody.error = message.error;
            }
        }
        if (status >= 500 && isProduction) {
            responseBody.message = 'Internal server error';
        }
        response.status(status).json(responseBody);
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map