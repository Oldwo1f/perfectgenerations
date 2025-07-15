import { PlanService } from './plan.service';
import { Plan } from './entities/plan.entity';
export declare class PlanController {
    private readonly planService;
    constructor(planService: PlanService);
    findAll(): Promise<Plan[]>;
}
