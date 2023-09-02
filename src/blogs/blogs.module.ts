import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { NotionModule } from 'nestjs-notion';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { HelperModule } from '../helper/helper.module';

@Module({
  imports: [
    // TODO: Fix process.env issue
    NotionModule.forRoot({
      auth: process.env.NOTION_TOKEN,
    }),
    TypeOrmModule.forFeature([Blog]),
    HelperModule,
  ],
  controllers: [BlogsController],
  providers: [BlogsService],
})
export class BlogsModule {}
