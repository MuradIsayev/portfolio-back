import { Injectable } from '@nestjs/common';
import { CreateWorkScheduleDto } from './dto/create-work-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkSchedule } from './entities/work-schedule.entity';
import { ErrorHandlerService } from '../helper/services/error-handler.service';

@Injectable()
export class WorkScheduleService {
  constructor(
    @InjectRepository(WorkSchedule)
    private workScheduleRepository: Repository<WorkSchedule>,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  async create(createWorkScheduleDto: CreateWorkScheduleDto) {
    try {
      const workSchedule = this.workScheduleRepository.create(createWorkScheduleDto);

      return await this.workScheduleRepository.save(workSchedule);
    } catch (e) {
      await this.errorHandlerService.checkDuplication(
        e,
        `WorkSchedule ${createWorkScheduleDto.type}`,
      );
    }
  }

  async findAll(): Promise<WorkSchedule[]> {
    return await this.workScheduleRepository.find();
  }

  async findOne(id: number): Promise<WorkSchedule> {
    const workSchedule: WorkSchedule =
      await this.workScheduleRepository.findOneBy({ id });

    this.errorHandlerService.checkEntity(workSchedule, `WorkSchedule ${id}`);

    return workSchedule;
  }

  async remove(id: number) {
    try {
      const workSchedule: WorkSchedule = await this.findOne(id);
      await this.workScheduleRepository.remove(workSchedule);

      return true;
    } catch (e) {
      this.errorHandlerService.checkError(e, `WorkSchedule ${id}`);
    }
  }
}
