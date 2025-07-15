import { Repository } from 'typeorm';
import { Plan } from './entities/plan.entity';
export declare class PlanService {
    private readonly planRepository;
    constructor(planRepository: Repository<Plan>);
    findAll(): Promise<Plan[]>;
    findById(id: string): Promise<Plan | null>;
}
