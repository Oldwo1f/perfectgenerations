import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class HealthService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async check() {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        status: 'unknown',
      },
    };

    try {
      // Vérifier la connexion à la base de données
      await this.connection.query('SELECT 1');
      health.database.status = 'connected';
    } catch (error) {
      health.status = 'unhealthy';
      health.database.status = 'disconnected';
      health.database.error = error instanceof Error ? error.message : 'Unknown error';
    }

    return health;
  }
}

