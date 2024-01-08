import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { ErrorHandlerService } from '../helper/services/error-handler.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}
  async create(createProjectDto: CreateProjectDto) {
    try {
      console.log(createProjectDto);
      console.log('API is working');
      const project: Project = this.projectRepository.create(createProjectDto);
      console.log(project);
      return await this.projectRepository.save(project);
    } catch (e) {
      console.error(e);
      await this.errorHandlerService.checkDuplication(
        e,
        `Project ${createProjectDto.name}`,
      );
    }
  }

  findAll() {
    return this.projectRepository.find();
  }

  async findOne(id: number): Promise<Project> {
    const project: Project = await this.projectRepository.findOneBy({ id });

    this.errorHandlerService.checkEntity(project, `Project ${id}`);

    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    try {
      const project: Project = await this.findOne(id);
      Object.assign(project, updateProjectDto);
      await this.projectRepository.save(project);

      return true;
    } catch (e) {
      this.errorHandlerService.checkError(
        e,
        `Project ${updateProjectDto.name}`,
      );
    }
  }

  async remove(id: number) {
    try {
      const project: Project = await this.findOne(id);
      await this.projectRepository.remove(project);

      return true;
    } catch (e) {
      this.errorHandlerService.checkError(e, `Project ${id}`);
    }
  }
}
