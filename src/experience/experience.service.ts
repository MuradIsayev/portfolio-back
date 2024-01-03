import { Injectable } from '@nestjs/common';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Experience } from './entities/experience.entity';
import { Repository } from 'typeorm';
import { WorkSchedule } from '../work-schedule/entities/work-schedule.entity';
import * as dayjs from 'dayjs';
import { ErrorHandlerService } from '../helper/services/error-handler.service';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experience)
    private experienceRepository: Repository<Experience>,
    @InjectRepository(WorkSchedule)
    private readonly workScheduleRepository: Repository<WorkSchedule>,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}
  async create(createExperienceDto: CreateExperienceDto) {
    const workSchedule: WorkSchedule =
      await this.workScheduleRepository.findOne({
        where: { id: createExperienceDto.workScheduleId },
      });

    this.errorHandlerService.checkEntity(
      workSchedule,
      `Work Schedule ${createExperienceDto.workScheduleId}`,
    );

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
    const experiences: Experience[] = await this.experienceRepository
      .createQueryBuilder('experience')
      .leftJoin('experience.workSchedule', 'workSchedule')
      .select([
        'experience.id as id',
        'experience.position as position',
        'experience.description as description',
        'experience.company as company',
        'experience.startedAt as startedAt',
        'experience.endedAt as endedAt',
        'workSchedule.type as workScheduleType',
      ])
      .getRawMany();

    this.errorHandlerService.checkEntity(experiences, 'Experiences');

    return experiences;
  }

  async findOneById(id: number) {
    return await this.experienceRepository.findOneBy({ id });
  }

  async findOne(id: number): Promise<Experience> {
    const experience: Experience = await this.experienceRepository
      .createQueryBuilder('experience')
      .leftJoin('experience.workSchedule', 'workSchedule')
      .where('experience.id = :id', { id })
      .select([
        'experience.id as id',
        'experience.position as position',
        'experience.description as description',
        'experience.company as company',
        'experience.startedAt as startedAt',
        'experience.endedAt as endedAt',
        'workSchedule.type as workScheduleType',
      ])
      .getRawOne();

    this.errorHandlerService.checkEntity(experience, `Experience ${id}`);

    return experience;
  }

  async update(id: number, updateExperienceDto: UpdateExperienceDto) {
    try {
      const experience: Experience = await this.findOneById(id);
      Object.assign(experience, updateExperienceDto);
      await this.experienceRepository.save(experience);

      return true;
    } catch (e) {
      this.errorHandlerService.checkError(e, `Experience ${id}`);
    }
  }

  async remove(id: number) {
    try {
      const experience: Experience = await this.findOneById(id);
      await this.experienceRepository.remove(experience);

      return true;
    } catch (e) {
      this.errorHandlerService.checkError(e, `Experience ${id}`);
    }
  }
}
