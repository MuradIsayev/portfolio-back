import { Module } from '@nestjs/common';
import { WorkScheduleService } from './work-schedule.service';
import { WorkScheduleController } from './work-schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkSchedule } from './entities/work-schedule.entity';
import { HelperModule } from '../helper/helper.module';

@Module({
  imports: [TypeOrmModule.forFeature([WorkSchedule]), HelperModule],
  controllers: [WorkScheduleController],
  providers: [WorkScheduleService]
})
export class WorkScheduleModule {}
