import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from './entities/plan.entity';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) {}

  async findAll(): Promise<Plan[]> {
    return this.planRepository.find({
      order: { priceMonthly: 'ASC' },
    });
  }

  async findById(id: string): Promise<Plan | null> {
    return this.planRepository.findOne({ where: { id } });
  }
}
