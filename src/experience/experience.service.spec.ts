import { Test, TestingModule } from '@nestjs/testing';
import { ExperienceService } from './experience.service';
import { DeepMocked } from '@golevelup/ts-jest';
import { Experience } from './entities/experience.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { universalMocker } from '../test/mock-factories';
import { HelperModule } from '../helper/helper.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WorkSchedule } from '../work-schedule/entities/work-schedule.entity';
import { UpdateExperienceDto } from './dto/update-experience.dto';

describe('WorkScheduleService', () => {
  let service: ExperienceService;
  let mockExperienceRepository: DeepMocked<Repository<Experience>>;
  let mockWorkScheduleRepository: DeepMocked<Repository<WorkSchedule>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExperienceService],
      imports: [HelperModule],
    })
      .useMocker(universalMocker)
      .compile();

    service = module.get<ExperienceService>(ExperienceService);
    mockExperienceRepository = module.get(getRepositoryToken(Experience));
    mockWorkScheduleRepository = module.get(getRepositoryToken(WorkSchedule));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    let experience: Experience;
    afterEach(() => {
      jest.clearAllMocks();
    });

    const createExperienceDto = {
      company: 'test',
      description: 'test',
      position: 'test',
      startedAt: new Date(),
      endedAt: new Date(),
      workScheduleId: 1,
    };

    beforeEach(() => {
      experience = new Experience();
      experience.id = 1;
      experience.company = 'test';
      experience.description = 'test';
      experience.position = 'test';
      experience.startedAt = 'test';
      experience.endedAt = 'test';
      experience.workSchedule = new WorkSchedule();
      experience.workSchedule.id = 1;
      experience.workSchedule.type = 'test';
    });

    it('should create one experience', async () => {
      mockWorkScheduleRepository.findOne.mockResolvedValueOnce(
        experience.workSchedule,
      );
      mockExperienceRepository.create.mockReturnValueOnce(experience);
      mockExperienceRepository.save.mockResolvedValueOnce(experience);

      const result = service.create(createExperienceDto);

      await expect(result).resolves.toBeDefined();
      expect(mockWorkScheduleRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockExperienceRepository.create).toHaveBeenCalledTimes(1);
      expect(mockExperienceRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw error if experience does not exist', async () => {
      mockWorkScheduleRepository.findOne.mockResolvedValueOnce(null);

      const result = service.create(createExperienceDto);

      await expect(result).rejects.toThrowError();
      expect(mockWorkScheduleRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockExperienceRepository.create).not.toBeCalled();
      expect(mockExperienceRepository.save).not.toBeCalled();
    });

  });

  describe('findAll', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return all experiences', async () => {
      mockExperienceRepository.createQueryBuilder.mockImplementation(
        () =>
          ({
            leftJoin: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            getRawMany: jest.fn().mockResolvedValueOnce([{}]),
          } as unknown as SelectQueryBuilder<Experience>),
      );

      const result = service.findAll();

      await expect(result).resolves.toBeDefined();
    });

    it('should throw error if experiences does not exist', async () => {
      mockExperienceRepository.createQueryBuilder.mockImplementation(
        () =>
          ({
            leftJoin: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            getRawMany: jest.fn().mockResolvedValueOnce(null),
          } as unknown as SelectQueryBuilder<Experience>),
      );

      const result = service.findAll();

      await expect(result).rejects.toThrowError();
    });
  });

  describe('findOneById', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return an experience', async () => {
      mockExperienceRepository.findOneBy.mockResolvedValueOnce(
        {} as Experience,
      );

      const result = service.findOneById(1);

      await expect(result).resolves.toBeDefined();
    });
  });

  describe('findOne', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return an experience', async () => {
      mockExperienceRepository.createQueryBuilder.mockImplementation(
        () =>
          ({
            leftJoin: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            getRawOne: jest.fn().mockResolvedValueOnce({} as Experience),
          } as unknown as SelectQueryBuilder<Experience>),
      );

      const result = service.findOne(1);

      await expect(result).resolves.toBeDefined();
    });

    it('should throw error if experience does not exist', async () => {
      mockExperienceRepository.createQueryBuilder.mockImplementation(
        () =>
          ({
            leftJoin: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            getRawOne: jest.fn().mockResolvedValueOnce(null),
          } as unknown as SelectQueryBuilder<Experience>),
      );

      const result = service.findOne(1);

      await expect(result).rejects.toThrowError();
    });
  });

  describe('update', () => {
    let experience: Experience;
    afterEach(() => {
      jest.clearAllMocks();
    });

    const updateExperienceDto: UpdateExperienceDto = {
      company: 'test',
      description: 'test',
      position: 'test',
      startedAt: new Date(),
      endedAt: new Date(),
      workScheduleId: 1,
    };

    beforeEach(() => {
      experience = new Experience();
      experience.id = 1;
      experience.company = 'test';
      experience.description = 'test';
      experience.position = 'test';
      experience.startedAt = 'test';
      experience.endedAt = 'test';
      experience.workSchedule = new WorkSchedule();
      experience.workSchedule.id = 1;
      experience.workSchedule.type = 'test';
    });

    it('should update one experience', async () => {
      service.findOneById = jest.fn().mockResolvedValueOnce(experience);
      mockExperienceRepository.save.mockResolvedValueOnce(experience);

      const result = service.update(1, updateExperienceDto);

      await expect(result).resolves.toBeTruthy();
      expect(service.findOneById).toHaveBeenCalledTimes(1);
      expect(mockExperienceRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw error if experience does not exist', async () => {
      service.findOneById = jest.fn().mockRejectedValueOnce(new Error());

      const result = service.update(1, updateExperienceDto);

      await expect(result).rejects.toThrowError();
      expect(service.findOneById).toHaveBeenCalledTimes(1);
      expect(mockExperienceRepository.save).not.toBeCalled();
    });
  });

  describe('remove', () => {
    let experience: Experience;
    afterEach(() => {
      jest.clearAllMocks();
    });

    beforeEach(() => {
      experience = new Experience();
      experience.id = 1;
      experience.company = 'test';
      experience.description = 'test';
      experience.position = 'test';
      experience.startedAt = 'test';
      experience.endedAt = 'test';
      experience.workSchedule = new WorkSchedule();
      experience.workSchedule.id = 1;
      experience.workSchedule.type = 'test';
    });

    it('should remove one experience', async () => {
      service.findOneById = jest.fn().mockResolvedValueOnce(experience);
      mockExperienceRepository.remove.mockResolvedValueOnce(experience);

      const result = service.remove(1);

      await expect(result).resolves.toBeTruthy();
      expect(service.findOneById).toHaveBeenCalledTimes(1);
      expect(mockExperienceRepository.remove).toHaveBeenCalledTimes(1);
    });

    it('should throw error if experience does not exist', async () => {
      service.findOneById = jest.fn().mockRejectedValueOnce(new Error());

      const result = service.remove(1);

      await expect(result).rejects.toThrowError();
      expect(service.findOneById).toHaveBeenCalledTimes(1);
      expect(mockExperienceRepository.remove).not.toBeCalled();
    });
  });
});
