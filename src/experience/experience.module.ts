import { Module } from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { ExperienceController } from './experience.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Experience } from './entities/experience.entity';
import { WorkSchedule } from 'src/work-schedule/entities/work-schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Experience, WorkSchedule])],
  controllers: [ExperienceController],
  providers: [ExperienceService],
})
export class ExperienceModule {}
