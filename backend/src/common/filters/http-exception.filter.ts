import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '../logger/logger.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const isProduction = process.env.NODE_ENV === 'production';

    // Log l'erreur
    const errorDetails = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: typeof message === 'string' ? message : (message as any).message || message,
    };

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} - ${status}`,
        exception instanceof Error ? exception.stack : String(exception),
        'HttpExceptionFilter',
      );
    } else {
      this.logger.warn(
        `${request.method} ${request.url} - ${status}: ${errorDetails.message}`,
        'HttpExceptionFilter',
      );
    }

    // Réponse formatée
    const responseBody: any = {
      statusCode: status,
      timestamp: errorDetails.timestamp,
      path: request.url,
    };

    if (typeof message === 'string') {
      responseBody.message = message;
    } else if (typeof message === 'object') {
      responseBody.message = (message as any).message || 'An error occurred';
      if (Array.isArray((message as any).message)) {
        responseBody.message = (message as any).message;
      }
      // En développement, inclure plus de détails
      if (!isProduction && (message as any).error) {
        responseBody.error = (message as any).error;
      }
    }

    // En production, ne pas exposer les détails d'erreur interne
    if (status >= 500 && isProduction) {
      responseBody.message = 'Internal server error';
    }

    response.status(status).json(responseBody);
  }
}

