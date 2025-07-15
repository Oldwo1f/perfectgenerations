import { Controller, Get } from '@nestjs/common';
import { PlanService } from './plan.service';
import { Plan } from './entities/plan.entity';

@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Get()
  async findAll(): Promise<Plan[]> {
    return this.planService.findAll();
  }
}
