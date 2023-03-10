import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Skill } from './entities/skill.entity';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill) private skillRepository: Repository<Skill>,
  ) {}
  async create(createSkillDto: CreateSkillDto) {
    const skill = await this.skillRepository.findOneBy({
      name: createSkillDto.name,
    });
    if (skill) {
      throw new Error('Skill already exists');
    }
    return await this.skillRepository.save(createSkillDto);
  }

  async findAll() {
    return await this.skillRepository.find();
  }

  findOne(id: number) {
    return this.skillRepository.findOneBy({ id });
  }

  async update(id: number, updateSkillDto: UpdateSkillDto) {
    const skill = await this.skillRepository.findOneBy({ id });
    if (!skill) {
      throw new Error('Skill not found');
    }
    Object.assign(skill, updateSkillDto);
    return await this.skillRepository.save(skill);
  }

  async remove(id: number) {
    const skill = await this.skillRepository.findOneBy({ id });
    if (!skill) {
      throw new Error('Skill not found');
    }
    return await this.skillRepository.remove(skill);
  }
}
