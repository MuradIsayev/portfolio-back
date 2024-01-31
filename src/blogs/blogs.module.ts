import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { HelperModule } from '../helper/helper.module';
import { NotionService } from './notion.service';

@Module({
  imports: [HelperModule],
  controllers: [BlogsController],
  providers: [BlogsService, NotionService],
})
export class BlogsModule {}
