import { Injectable } from '@nestjs/common';
import { CreateWorkScheduleDto } from './dto/create-work-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkSchedule } from './entities/work-schedule.entity';

@Injectable()
export class WorkScheduleService {
  constructor(
    @InjectRepository(WorkSchedule)
    private workScheduleRepository: Repository<WorkSchedule>,
  ) {}

  async create(createWorkScheduleDto: CreateWorkScheduleDto) {
    const workSchedule = this.create(createWorkScheduleDto);
    return await this.workScheduleRepository.save(workSchedule);
  }

  findAll() {
    return this.workScheduleRepository.find();
  }
}
