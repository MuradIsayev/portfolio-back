import { BasicSeeder } from '../basic-seeder';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkSchedule } from 'src/work-schedule/entities/work-schedule.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class WorkScheduleSeeder extends BasicSeeder<WorkSchedule> {
  constructor(
    dataSource: DataSource,
    @InjectRepository(WorkSchedule) repository: Repository<WorkSchedule>,
  ) {
    super(dataSource, repository, 'WorkScheduleSeeder');
  }

  async create_data() {
    const data: WorkSchedule[] = [];

    data.push(
      this.repository.create({
        type: 'part-time',
      }),
    );

    data.push(
      this.repository.create({
        type: 'full-time',
      }),
    );

    return data;
  }
}
