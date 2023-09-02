import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Skill } from './entities/skill.entity';
import { ErrorHandlerService } from '../helper/services/error-handler.service';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill) private skillRepository: Repository<Skill>,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}
  async create(createSkillDto: CreateSkillDto) {
    try {
      const skill = this.skillRepository.create(createSkillDto);

      return await this.skillRepository.save(skill);
    } catch (e) {
      await this.errorHandlerService.checkDuplication(
        e,
        `Skill ${createSkillDto.name}`,
      );
    }
  }

  async findAll() {
    return await this.skillRepository.find();
  }

  async findOne(id: number): Promise<Skill> {
    const skill: Skill = await this.skillRepository.findOneBy({ id });

    this.errorHandlerService.checkEntity(skill, `Skill ${id}`);

    return skill;
  }

  async update(id: number, updateSkillDto: UpdateSkillDto) {
    try {
      const skill: Skill = await this.findOne(id);
      Object.assign(skill, updateSkillDto);
      await this.skillRepository.save(skill);

      return true;
    } catch (e) {
      this.errorHandlerService.checkError(e, `Skill ${updateSkillDto.name}`);
    }
  }

  async remove(id: number) {
    try {
      const skill: Skill = await this.findOne(id);
      await this.skillRepository.remove(skill);

      return true;
    } catch (e) {
      this.errorHandlerService.checkError(e, `Skill ${id}`);
    }
  }
}
