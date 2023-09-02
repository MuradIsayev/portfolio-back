import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { ErrorHandlerService } from '../helper/services/error-handler.service';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}
  async create(createTagDto: CreateTagDto) {
    try {
      const tag = this.tagRepository.create(createTagDto);

      return await this.tagRepository.save(tag);
    } catch (e) {
      await this.errorHandlerService.checkDuplication(
        e,
        `Tag ${createTagDto.name}`,
      );
    }
  }

  async findAll() {
    const uniqueTags: Tag[] = await this.tagRepository
      .createQueryBuilder('tag')
      .select('tag.name', 'tag')
      .distinct(true)
      .getRawMany();

    return uniqueTags;
  }

  async findOne(id: number): Promise<Tag> {
    const tag: Tag = await this.tagRepository.findOneBy({ id });

    this.errorHandlerService.checkEntity(tag, `Tag ${id}`);

    return tag;
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    try {
      const tag: Tag = await this.findOne(id);
      Object.assign(tag, updateTagDto);
      await this.tagRepository.save(tag);

      return true;
    } catch (e) {
      this.errorHandlerService.checkError(e, `Tag ${id}`);
    }
  }

  async remove(id: number) {
    try {
      const tag: Tag = await this.findOne(id);
      await this.tagRepository.remove(tag);

      return true;
    } catch (e) {
      this.errorHandlerService.checkError(e, `Tag ${id}`);
    }
  }
}
