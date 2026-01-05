import { Connection } from 'typeorm';
export declare class HealthService {
    private readonly connection;
    constructor(connection: Connection);
    check(): Promise<{
        status: string;
        timestamp: string;
        uptime: number;
        database: {
            status: string;
        };
    }>;
}
