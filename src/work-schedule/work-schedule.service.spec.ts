import { Test, TestingModule } from '@nestjs/testing';
import { WorkScheduleService } from './work-schedule.service';
import { DeepMocked } from '@golevelup/ts-jest';
import { WorkSchedule } from './entities/work-schedule.entity';
import { Repository } from 'typeorm';
import { universalMocker } from '../test/mock-factories';
import { HelperModule } from '../helper/helper.module';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('WorkScheduleService', () => {
  let service: WorkScheduleService;
  let mockWorkScheduleRepository: DeepMocked<Repository<WorkSchedule>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkScheduleService],
      imports: [HelperModule],
    })
      .useMocker(universalMocker)
      .compile();

    service = module.get<WorkScheduleService>(WorkScheduleService);
    mockWorkScheduleRepository = module.get(getRepositoryToken(WorkSchedule));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    let workSchedule: WorkSchedule;

    afterEach(() => {
      jest.clearAllMocks();
    });

    beforeEach(() => {
      workSchedule = new WorkSchedule();
      workSchedule.id = 1;
      workSchedule.type = 'test';
    });

    it('should create a work schedule', async () => {
      mockWorkScheduleRepository.save.mockResolvedValueOnce(workSchedule);

      await expect(service.create({ type: 'test' })).resolves.toEqual(
        workSchedule,
      );

      expect(mockWorkScheduleRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw error if work schedule already exists', async () => {
      mockWorkScheduleRepository.save.mockRejectedValueOnce({
        code: '23505',
      });

      await expect(service.create({ type: 'test' })).rejects.toThrowError();

      expect(mockWorkScheduleRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return all work schedules', async () => {
      mockWorkScheduleRepository.find.mockResolvedValue([] as WorkSchedule[]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockWorkScheduleRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    let workSchedule: WorkSchedule;
    afterEach(() => {
      jest.clearAllMocks();
    });

    beforeEach(() => {
      workSchedule = new WorkSchedule();
      workSchedule.id = 1;
      workSchedule.type = 'test';
    });

    it('should return one work schedule', async () => {
      mockWorkScheduleRepository.findOneBy.mockResolvedValueOnce(workSchedule);

      const result = service.findOne(1);
      await expect(result).resolves.toMatchObject(workSchedule);
      
      expect(mockWorkScheduleRepository.findOneBy).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    let workSchedule: WorkSchedule;
    afterEach(() => {
      jest.clearAllMocks();
    });

    beforeEach(() => {
      workSchedule = new WorkSchedule();
      workSchedule.id = 1;
      workSchedule.type = 'test';
    });

    it('should remove one work schedule', async () => {
      service.findOne = jest.fn().mockResolvedValueOnce(workSchedule);
      mockWorkScheduleRepository.remove.mockResolvedValueOnce(workSchedule);

      const result = service.remove(1);

      await expect(result).resolves.toBeTruthy();
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(mockWorkScheduleRepository.remove).toHaveBeenCalledTimes(1);
    });

    it('should throw error if work schedule does not exist', async () => {
      service.findOne = jest.fn().mockRejectedValueOnce(new Error());

      const result = service.remove(1);

      await expect(result).rejects.toThrowError();
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(mockWorkScheduleRepository.remove).not.toBeCalled();
    });
  });
});
