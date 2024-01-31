import { Injectable } from '@nestjs/common';
import { NotionService } from './notion.service';

@Injectable()
export class BlogsService {
  constructor(private readonly notionService: NotionService) {}

  async findAll() {
    return await this.notionService.getPublishedPosts();
  }

  async getSinglePost(slug: string) {
    return await this.notionService.getSinglePost(slug);
  }

  async updateViewCount(slug: string) {
    return await this.notionService.updateViewCount(slug);
  }

  // async findFiltered(tag: string) {
  //   let blogs: Blog[];

  //   try {
  //     blogs = await this.blogRepository.find({
  //       relations: { tags: true },
  //     });
  //   } catch (error) {
  //     throw new BadRequestException('Blogs are not found');
  //   }

  //   return blogs.length
  //     ? blogs.filter((blog) => blog.tags.some((t) => t.name === tag))
  //     : null;
  // }
}
