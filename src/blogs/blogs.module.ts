import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { NotionModule } from 'nestjs-notion';

@Module({
  imports: [
    NotionModule.forRoot({
      auth: 'secret_Ooy09BQepK2ewbBIBTjWlC5BU2vLVa6ivuMJPaJUrx2',
    }),
  ],
  controllers: [BlogsController],
  providers: [BlogsService],
})
export class BlogsModule {}
