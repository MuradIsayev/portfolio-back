import { Test, TestingModule } from '@nestjs/testing';
import { SkillsService } from './skills.service';
import { DeepMocked } from '@golevelup/ts-jest';
import { Skill } from './entities/skill.entity';
import { Repository } from 'typeorm';
import { universalMocker } from '../test/mock-factories';
import { HelperModule } from '../helper/helper.module';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('SkillsService', () => {
  let service: SkillsService;
  let mockSkillsRepository: DeepMocked<Repository<Skill>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SkillsService],
      imports: [HelperModule],
    })
      .useMocker(universalMocker)
      .compile();

    service = module.get<SkillsService>(SkillsService);
    mockSkillsRepository = module.get(getRepositoryToken(Skill));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    let skill: Skill;

    afterEach(() => {
      jest.clearAllMocks();
    });

    beforeEach(() => {
      skill = new Skill();
      skill.id = 1;
      skill.name = 'test';
    });

    it('should create a work schedule', async () => {
      mockSkillsRepository.save.mockResolvedValueOnce(skill);

      await expect(service.create({ name: 'test' })).resolves.toEqual(
        skill,
      );

      expect(mockSkillsRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw error if work schedule already exists', async () => {
      mockSkillsRepository.save.mockRejectedValueOnce({
        code: '23505',
      });

      await expect(service.create({ name: 'test' })).rejects.toThrowError();

      expect(mockSkillsRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return all work schedules', async () => {
      mockSkillsRepository.find.mockResolvedValue([] as Skill[]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockSkillsRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    let skill: Skill;
    afterEach(() => {
      jest.clearAllMocks();
    });

    beforeEach(() => {
      skill = new Skill();
      skill.id = 1;
      skill.name = 'test';
    });

    it('should return one work schedule', async () => {
      mockSkillsRepository.findOneBy.mockResolvedValueOnce(skill);

      const result = service.findOne(1);
      await expect(result).resolves.toMatchObject(skill);
      
      expect(mockSkillsRepository.findOneBy).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    let skill: Skill;
    afterEach(() => {
      jest.clearAllMocks();
    });

    beforeEach(() => {
      skill = new Skill();
      skill.id = 1;
      skill.name = 'test';
    });

    it('should remove one work schedule', async () => {
      service.findOne = jest.fn().mockResolvedValueOnce(skill);
      mockSkillsRepository.remove.mockResolvedValueOnce(skill);

      const result = service.remove(1);

      await expect(result).resolves.toBeTruthy();
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(mockSkillsRepository.remove).toHaveBeenCalledTimes(1);
    });

    it('should throw error if work schedule does not exist', async () => {
      service.findOne = jest.fn().mockRejectedValueOnce(new Error());

      const result = service.remove(1);

      await expect(result).rejects.toThrowError();
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(mockSkillsRepository.remove).not.toBeCalled();
    });
  });
});
