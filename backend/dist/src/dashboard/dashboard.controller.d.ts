import { DashboardService } from './dashboard.service';
import { User } from '../user/entities/user.entity';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getStats(user: User): Promise<import("./dashboard.service").UserStats>;
    getActivity(user: User): Promise<import("./dashboard.service").UserActivity[]>;
}
