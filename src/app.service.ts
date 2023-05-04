import { Injectable } from '@nestjs/common';
import { NotionService } from 'nestjs-notion';

@Injectable()
export class AppService {
  constructor(private readonly notionService: NotionService) {}
  async getHello() {
    return this.notionService.blocks.children.list({
      block_id: 'f5349c902cdf45deafe570f1f9bc1fd4',
    });
  }
}
