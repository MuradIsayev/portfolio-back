import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}
  @Get('search/')
  findByTag(@Query('tag') tag: string) {
    return this.blogsService.findFiltered(tag);
  }

  @Get('random')
  findRandom() {
    return this.blogsService.findRandom();
  }

  @Get()
  findAll() {
    return this.blogsService.findAll();
  }

  @Get('content/:blockId')
  findOne(@Param('blockId') blockId: string) {
    return this.blogsService.findOne(blockId);
  }

  @Post()
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogsService.create(createBlogDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogsService.update(+id, updateBlogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogsService.remove(+id);
  }
}
