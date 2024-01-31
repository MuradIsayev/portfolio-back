import { Test, TestingModule } from '@nestjs/testing';
import { BlogsService } from './blogs.service';
import { HelperModule } from '../helper/helper.module';
import { universalMocker } from '../test/mock-factories';

describe('BlogsService', () => {
  let service: BlogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlogsService],
      imports: [HelperModule],
    })
      .useMocker(universalMocker)
      .compile();

    service = module.get<BlogsService>(BlogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
