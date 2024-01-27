import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './entities/blog.entity';
import { ErrorHandlerService } from '../helper/services/error-handler.service';
import { NotionService } from './notion.service';

@Injectable()
export class BlogsService {
  constructor(
    private readonly notionService: NotionService,
    @InjectRepository(Blog) private readonly blogRepository: Repository<Blog>,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  async findAll() {
    return await this.notionService.getPublishedPosts();
  }

  async getSinglePost(slug: string) {
    return await this.notionService.getSinglePost(slug);
  }

  async create(createBlogDto: CreateBlogDto) {
    // const pageData = await this.notionService.pages.retrieve({
    //   page_id: createBlogDto.blockId,
    // });
    // if (!pageData) throw new BadRequestException('Page not found');
    // const titleProperty = pageData.properties.title;
    // if (titleProperty.type === 'title') {
    //   const title = titleProperty.title[0].plain_text;
    //   const createdAt = dayjs(pageData.created_time).format('MMMM D, YYYY');
    //   const blogContent = this.blogRepository.create({
    //     ...createBlogDto,
    //     title,
    //     createdAt,
    //   });
    //   return this.blogRepository.save(blogContent);
    // } else {
    //   throw new BadRequestException('Invalid title property');
    // }
  }

  findOne(blockId: string) {
    const blogContent = this.blogRepository.findOneBy({ blockId });
    if (!blogContent) throw new BadRequestException('Blog not found');

    return blogContent;
  }

  findOneById(id: number): Promise<Blog> {
    const blog = this.blogRepository.findOneBy({ id });

    this.errorHandlerService.checkEntity(blog, `Blog ${id}`);

    return blog;
  }

  async findRandom() {
    const blogs: Blog[] = await this.blogRepository.find();
    const randomPost = blogs[Math.floor(Math.random() * blogs.length)];
    if (!randomPost) throw new BadRequestException('Blog not found');

    return randomPost;
  }

  async update(id: number, updateBlogDto: UpdateBlogDto) {
    try {
      const blog: Blog = await this.findOneById(id);
      Object.assign(blog, updateBlogDto);
      await this.blogRepository.save(blog);

      return true;
    } catch (e) {
      this.errorHandlerService.checkError(e, `Blog ${id}`);
    }
  }

  async remove(id: number) {
    try {
      const blog: Blog = await this.findOneById(id);
      await this.blogRepository.remove(blog);

      return true;
    } catch (e) {
      this.errorHandlerService.checkError(e, `Blog ${id}`);
    }
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
