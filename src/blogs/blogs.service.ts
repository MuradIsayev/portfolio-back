import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { NotionService } from 'nestjs-notion';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './entities/blog.entity';
import * as dayjs from 'dayjs';

@Injectable()
export class BlogsService {
  constructor(
    private readonly notionService: NotionService,
    @InjectRepository(Blog) private readonly blogRepository: Repository<Blog>,
  ) {}

  async getBlogs(blockId: string) {
    const data = await this.notionService.blocks.children.list({
      block_id: blockId,
    });
    return data.results;
  }

  async create(createBlogDto: CreateBlogDto) {
    const pageData = await this.notionService.pages.retrieve({
      page_id: createBlogDto.blockId,
    });
    if (!pageData) throw new BadRequestException('Page not found');

    const titleProperty = pageData.properties.title;
    if (titleProperty.type === 'title') {
      const title = titleProperty.title[0].plain_text;
      const createdAt = dayjs(pageData.created_time).format('MMMM D, YYYY');
      const blogContent = this.blogRepository.create({
        ...createBlogDto,
        title,
        createdAt,
      });
      return this.blogRepository.save(blogContent);
    } else {
      throw new BadRequestException('Invalid title property');
    }
  }

  findAll() {
    return this.blogRepository.find();
  }

  findOne(blockId: string) {
    const blogContent = this.blogRepository.findOneBy({ blockId });
    if (!blogContent) throw new BadRequestException('Blog not found');

    return blogContent;
  }

  async findRandom() {
    const blogs = await this.blogRepository.find();
    const randomPost = blogs[Math.floor(Math.random() * blogs.length)];
    if (!randomPost) throw new BadRequestException('Blog not found');

    return randomPost;
  }

  async update(id: number, updateBlogDto: UpdateBlogDto) {
    const blogContent = await this.blogRepository.findOneBy({ id });
    if (!blogContent) throw new BadRequestException('Blog not found');

    Object.assign(blogContent, updateBlogDto);
    return this.blogRepository.save(blogContent);
  }

  async remove(id: number) {
    const blogContent = await this.blogRepository.findOneBy({ id });
    if (!blogContent) throw new BadRequestException('Blog not found');

    return this.blogRepository.remove(blogContent);
  }

  async findFiltered(tag: string) {
    let blogs: Blog[];

    try {
      blogs = await this.blogRepository.find({
        relations: { tags: true },
      });
    } catch (error) {
      throw new BadRequestException('Blogs are not found');
    }

    return blogs.length
      ? blogs.filter((blog) => blog.tags.some((t) => t.name === tag))
      : null;
  }
}
