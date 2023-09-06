import { Test, TestingModule } from '@nestjs/testing';
import { TagsService } from './tags.service';
import { DeepMocked } from '@golevelup/ts-jest';
import { Tag } from './entities/tag.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { universalMocker } from '../test/mock-factories';
import { HelperModule } from '../helper/helper.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UpdateTagDto } from './dto/update-tag.dto';

describe('WorkScheduleService', () => {
  let service: TagsService;
  let mockTagsRepository: DeepMocked<Repository<Tag>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TagsService],
      imports: [HelperModule],
    })
      .useMocker(universalMocker)
      .compile();

    service = module.get<TagsService>(TagsService);
    mockTagsRepository = module.get(getRepositoryToken(Tag));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    let tag: Tag;

    afterEach(() => {
      jest.clearAllMocks();
    });

    beforeEach(() => {
      tag = new Tag();
      tag.id = 1;
      tag.name = 'test';
    });

    it('should create a tag', async () => {
      mockTagsRepository.save.mockResolvedValueOnce(tag);

      await expect(service.create({ name: 'test' })).resolves.toEqual(tag);

      expect(mockTagsRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw error if tag already exists', async () => {
      mockTagsRepository.save.mockRejectedValueOnce({
        code: '23505',
      });

      await expect(service.create({ name: 'test' })).rejects.toThrowError();

      expect(mockTagsRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return all tags', async () => {
      const expected = [
        {
          tag: 'test',
        },
        {
          tag: 'test',
        },
      ];
      mockTagsRepository.createQueryBuilder.mockImplementation(
        () =>
          ({
            select: jest.fn().mockReturnThis(),
            distinct: jest.fn().mockReturnThis(),
            getRawMany: jest.fn().mockResolvedValue(expected),
          } as unknown as SelectQueryBuilder<Tag>),
      );

      const result = service.findAll();

      await expect(result).resolves.toMatchObject(expected);
    });
  });

  describe('findOne', () => {
    let tag: Tag;
    afterEach(() => {
      jest.clearAllMocks();
    });

    beforeEach(() => {
      tag = new Tag();
      tag.id = 1;
      tag.name = 'test';
    });

    it('should return one tag', async () => {
      mockTagsRepository.findOneBy.mockResolvedValueOnce(tag);

      const result = service.findOne(1);
      await expect(result).resolves.toMatchObject(tag);

      expect(mockTagsRepository.findOneBy).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    let tag: Tag;
    afterEach(() => {
      jest.clearAllMocks();
    });

    const updateTagDto: UpdateTagDto = {
      name: 'test',
    };

    beforeEach(() => {
      tag = new Tag();
      tag.id = 1;
      tag.name = 'test';
    });

    it('should update one tag', async () => {
      service.findOne = jest.fn().mockResolvedValueOnce(tag);
      mockTagsRepository.save.mockResolvedValueOnce(tag);

      const result = service.update(1, updateTagDto);

      await expect(result).resolves.toBeTruthy();
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(mockTagsRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw error if tag does not exist', async () => {
      service.findOne = jest.fn().mockRejectedValueOnce(new Error());

      const result = service.update(1, { name: 'test' });

      await expect(result).rejects.toThrowError();
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(mockTagsRepository.save).not.toBeCalled();
    });
  });

  describe('remove', () => {
    let tag: Tag;
    afterEach(() => {
      jest.clearAllMocks();
    });

    beforeEach(() => {
      tag = new Tag();
      tag.id = 1;
      tag.name = 'test';
    });

    it('should remove one tag', async () => {
      service.findOne = jest.fn().mockResolvedValueOnce(tag);
      mockTagsRepository.remove.mockResolvedValueOnce(tag);

      const result = service.remove(1);

      await expect(result).resolves.toBeTruthy();
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(mockTagsRepository.remove).toHaveBeenCalledTimes(1);
    });

    it('should throw error if tag does not exist', async () => {
      service.findOne = jest.fn().mockRejectedValueOnce(new Error());

      const result = service.remove(1);

      await expect(result).rejects.toThrowError();
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(mockTagsRepository.remove).not.toBeCalled();
    });
  });
});
