import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { DeepMocked } from '@golevelup/ts-jest';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { universalMocker } from '../test/mock-factories';
import { HelperModule } from '../helper/helper.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UpdateProjectDto } from './dto/update-project.dto';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let mockProjectsRepository: DeepMocked<Repository<Project>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectsService],
      imports: [HelperModule],
    })
      .useMocker(universalMocker)
      .compile();

    service = module.get<ProjectsService>(ProjectsService);
    mockProjectsRepository = module.get(getRepositoryToken(Project));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    let project: Project;

    afterEach(() => {
      jest.clearAllMocks();
    });

    beforeEach(() => {
      project = new Project();
      project.id = 1;
      project.name = 'test';
      project.description = 'test';
      project.url = 'test';
      project.skills = [];
    });

    it('should create a project', async () => {
      mockProjectsRepository.save.mockResolvedValueOnce(project);

      await expect(
        service.create({
          name: 'test',
          description: 'test',
          url: 'test',
          skills: [],
        }),
      ).resolves.toEqual(project);

      expect(mockProjectsRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw error if project already exists', async () => {
      mockProjectsRepository.save.mockRejectedValueOnce({
        code: '23505',
      });

      await expect(
        service.create({
          name: 'test',
          description: 'test',
          url: 'test',
          skills: [],
        }),
      ).rejects.toThrowError();

      expect(mockProjectsRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return all projects', async () => {
      mockProjectsRepository.find.mockResolvedValue([] as Project[]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockProjectsRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    let project: Project;
    afterEach(() => {
      jest.clearAllMocks();
    });

    beforeEach(() => {
      project = new Project();
      project.id = 1;
      project.name = 'test';
      project.description = 'test';
      project.url = 'test';
      project.skills = [];
    });

    it('should return one project', async () => {
      mockProjectsRepository.findOneBy.mockResolvedValueOnce(project);

      const result = service.findOne(1);
      await expect(result).resolves.toMatchObject(project);

      expect(mockProjectsRepository.findOneBy).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    let project: Project;
    afterEach(() => {
      jest.clearAllMocks();
    });

    const updateProjectDto: UpdateProjectDto = {
      name: 'test',
      description: 'test',
      url: 'test',
      skills: [],
    };

    beforeEach(() => {
      project = new Project();
      project.id = 1;
      project.name = 'test';
      project.description = 'test';
      project.url = 'test';
      project.skills = [];
    });

    it('should update one project', async () => {
      service.findOne = jest.fn().mockResolvedValueOnce(project);
      mockProjectsRepository.save.mockResolvedValueOnce(project);

      const result = service.update(1, updateProjectDto);

      await expect(result).resolves.toBeTruthy();
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(mockProjectsRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw error if project does not exist', async () => {
      service.findOne = jest.fn().mockRejectedValueOnce(new Error());

      const result = service.update(1, updateProjectDto);

      await expect(result).rejects.toThrowError();
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(mockProjectsRepository.save).not.toBeCalled();
    });
  });

  describe('remove', () => {
    let project: Project;
    afterEach(() => {
      jest.clearAllMocks();
    });

    beforeEach(() => {
      project = new Project();
      project.id = 1;
      project.name = 'test';
      project.description = 'test';
      project.url = 'test';
    });

    it('should remove one project', async () => {
      service.findOne = jest.fn().mockResolvedValueOnce(project);
      mockProjectsRepository.remove.mockResolvedValueOnce(project);

      const result = service.remove(1);

      await expect(result).resolves.toBeTruthy();
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(mockProjectsRepository.remove).toHaveBeenCalledTimes(1);
    });

    it('should throw error if project does not exist', async () => {
      service.findOne = jest.fn().mockRejectedValueOnce(new Error());

      const result = service.remove(1);

      await expect(result).rejects.toThrowError();
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(mockProjectsRepository.remove).not.toBeCalled();
    });
  });
});
