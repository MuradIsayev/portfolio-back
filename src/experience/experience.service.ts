import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Experience } from './entities/experience.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experience)
    private experienceRepository: Repository<Experience>,
  ) {}
  create(createExperienceDto: CreateExperienceDto) {
    const experience = this.experienceRepository.create(createExperienceDto);
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
