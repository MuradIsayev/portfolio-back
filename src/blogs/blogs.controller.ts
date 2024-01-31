import { Controller, Get, Param, Patch } from '@nestjs/common';
import { BlogsService } from './blogs.service';

@Controller('blog')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}
  // @Get('search/')
  // findByTag(@Query('tag') tag: string) {
  //   return this.blogsService.findFiltered(tag);
  // }

  @Get()
  findAll() {
    return this.blogsService.findAll();
  }

  @Get(':slug')
  getSinglePost(@Param('slug') slug: string) {
    return this.blogsService.getSinglePost(slug);
  }

  @Patch('viewCount/:slug')
  updateViewCount(@Param('slug') slug: string) {
    return this.blogsService.updateViewCount(slug);
  }
}
