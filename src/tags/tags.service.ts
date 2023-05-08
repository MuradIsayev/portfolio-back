import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(@InjectRepository(Tag) private tagRepository: Repository<Tag>) {}
  async create(createTagDto: CreateTagDto) {
    const tag = this.tagRepository.findOneBy({ name: createTagDto.name });
    if (tag) {
      throw new Error('Tag already exists');
    }

    return await this.tagRepository.save(createTagDto);
  }

  async findAll() {
    const uniqueTags = await this.tagRepository
      .createQueryBuilder('tag')
      .select('tag.name', 'tag')
      .distinct(true)
      .getRawMany();

    return uniqueTags;
    
  }

  async findOne(id: number) {
    return await this.tagRepository.findOneBy({ id });
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    const tag = await this.findOne(id);
    if (!tag) {
      throw new Error('Tag not found');
    }

    Object.assign(tag, updateTagDto);
    return await this.tagRepository.save(tag);
  }

  async remove(id: number) {
    const tag = await this.findOne(id);
    if (!tag) {
      throw new Error('Tag not found');
    }

    return await this.tagRepository.remove(tag);
  }
}
