import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Experience } from './entities/experience.entity';
import { Repository } from 'typeorm';
import { WorkSchedule } from 'src/work-schedule/entities/work-schedule.entity';
import * as dayjs from 'dayjs';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experience)
    private experienceRepository: Repository<Experience>,
    @InjectRepository(WorkSchedule)
    private readonly workScheduleRepository: Repository<WorkSchedule>,
  ) {}
  async create(createExperienceDto: CreateExperienceDto) {
    const workSchedule = await this.workScheduleRepository.findOne({
      where: { id: createExperienceDto.workScheduleId },
    });
    if (!workSchedule) {
      throw new NotFoundException(
        `WorkSchedule #${createExperienceDto.workScheduleId} not found`,
      );
    }

    const startedAt = dayjs(createExperienceDto.startedAt).format('MMM YYYY');
    const endedAt = dayjs(createExperienceDto.endedAt).format('MMM YYYY');

    const experience = this.experienceRepository.create({
      ...createExperienceDto,
      workSchedule,
      startedAt,
      endedAt,
    });

    return this.experienceRepository.save(experience);
  }

  async findAll() {
    return await this.experienceRepository.find();
  }

  async findOneById(id: number) {
    return await this.experienceRepository.findOneBy({ id });
  }

  async findOne(id: number) {
    const experience = await this.findOneById(id);

    if (!experience) {
      throw new NotFoundException(`Experience #${id} not found`);
    }

    return experience;
  }

  async update(id: number, updateExperienceDto: UpdateExperienceDto) {
    const experience = await this.findOneById(id);

    if (!experience) {
      throw new NotFoundException(`Experience #${id} not found`);
    }
    Object.assign(experience, updateExperienceDto);

    return await this.experienceRepository.save(experience);
  }

  async remove(id: number) {
    const experience = await this.findOneById(id);

    if (!experience) {
      throw new NotFoundException(`Experience #${id} not found`);
    }

    return this.experienceRepository.remove(experience);
  }
}
