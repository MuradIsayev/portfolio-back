import { Test, TestingModule } from '@nestjs/testing';
import { BlogsService } from './blogs.service';
import { HelperModule } from '../helper/helper.module';
import { universalMocker } from '../test/mock-factories';
import { DeepMocked } from '@golevelup/ts-jest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './entities/blog.entity';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Tag } from '../tags/entities/tag.entity';
import { BadRequestException } from '@nestjs/common';

describe('BlogsService', () => {
  let service: BlogsService;
  let mockBlogRepository: DeepMocked<Repository<Blog>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlogsService],
      imports: [HelperModule],
    })
      .useMocker(universalMocker)
      .compile();

    service = module.get<BlogsService>(BlogsService);
    mockBlogRepository = module.get(getRepositoryToken(Blog));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return a blog', async () => {
      mockBlogRepository.findOneBy.mockResolvedValueOnce({} as Blog);

      const result = service.findOne('test');

      await expect(result).resolves.toBeDefined();
      expect(mockBlogRepository.findOneBy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    let blogs: Blog[];
    beforeEach(() => {
      blogs = [new Blog(), new Blog()];
    });

    it('should return all blogs', async () => {
      mockBlogRepository.find.mockResolvedValue(blogs);

      const result = await service.findAll();

      expect(result).toEqual(blogs);
      expect(mockBlogRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOneById', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return a blog', async () => {
      mockBlogRepository.findOneBy.mockResolvedValueOnce({} as Blog);

      const result = service.findOneById(1);

      await expect(result).resolves.toBeDefined();
    });
  });

  describe('update', () => {
    let updateBlogDto: UpdateBlogDto;
    afterEach(() => {
      jest.clearAllMocks();
    });

    updateBlogDto = new UpdateBlogDto();
    updateBlogDto.blockId = 'test';
    updateBlogDto.description = 'test';
    updateBlogDto.minsRead = 1;
    updateBlogDto.tags = [new Tag()];

    it('should update a blog', async () => {
      service.findOneById = jest.fn().mockResolvedValueOnce({} as Blog);
      mockBlogRepository.save.mockResolvedValueOnce({} as Blog);

      const result = service.update(1, updateBlogDto);

      await expect(result).resolves.toBeTruthy();
      expect(service.findOneById).toHaveBeenCalledTimes(1);
      expect(mockBlogRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw error if blog does not exist', async () => {
      service.findOneById = jest.fn().mockRejectedValueOnce(new Error());

      const result = service.update(1, updateBlogDto);

      await expect(result).rejects.toThrowError();
      expect(service.findOneById).toHaveBeenCalledTimes(1);
      expect(mockBlogRepository.save).not.toBeCalled();
    });
  });

  describe('remove', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should remove a blog', async () => {
      service.findOneById = jest.fn().mockResolvedValueOnce({} as Blog);
      mockBlogRepository.remove.mockResolvedValueOnce({} as Blog);

      const result = service.remove(1);

      await expect(result).resolves.toBeTruthy();
      expect(service.findOneById).toHaveBeenCalledTimes(1);
      expect(mockBlogRepository.remove).toHaveBeenCalledTimes(1);
    });

    it('should throw error if blog does not exist', async () => {
      service.findOneById = jest.fn().mockRejectedValueOnce(new Error());

      const result = service.remove(1);

      await expect(result).rejects.toThrowError();
      expect(service.findOneById).toHaveBeenCalledTimes(1);
      expect(mockBlogRepository.remove).not.toBeCalled();
    });
  });
});
