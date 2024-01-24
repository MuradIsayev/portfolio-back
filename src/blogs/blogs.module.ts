import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
// import { NotionModule } from 'nestjs-notion';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { HelperModule } from '../helper/helper.module';
import { NotionService } from './notion.service';

@Module({
  imports: [TypeOrmModule.forFeature([Blog]), HelperModule],
  controllers: [BlogsController],
  providers: [BlogsService, NotionService],
})
export class BlogsModule {}
