import { Injectable } from '@nestjs/common';
import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { Blog, Tag } from './types';
import * as dayjs from 'dayjs';
import * as relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

@Injectable()
export class NotionService {
  private readonly client: Client;
  private readonly notionToMarkdown: NotionToMarkdown;

  constructor() {
    this.client = new Client({ auth: process.env.NOTION_ACCESS_TOKEN });
    this.notionToMarkdown = new NotionToMarkdown({ notionClient: this.client });
  }

  async getPublishedPosts(): Promise<Blog[]> {
    const databaseID = process.env.NOTION_BLOG_DATABASE_ID || '';

    // list blog posts
    const response = await this.client.databases.query({
      database_id: databaseID,
      filter: {
        property: 'Published',
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: 'Date',
          direction: 'descending',
        },
      ],
    });

    return response.results.map((page) => {
      return NotionService.pageToPostTransformer(page);
    });
  }

  private static pageToPostTransformer(page: any): Blog {
    const formattedDate = dayjs(page.properties.Date.created_time).format(
      'MMMM D, YYYY',
    );

    const fromNow = dayjs(page.properties.Date.created_time).fromNow();

    const fullDate = `${formattedDate} (${fromNow})`;

    return {
      id: page.id,
      title: page.properties.Title.title[0].plain_text,
      description: page.properties.Description.rich_text[0].plain_text,
      slug: page.properties.Slug.formula.string,
      createdAt: fullDate,
      minsRead: page.properties.ReadingTime.number,
      tags: page.properties.Tags.multi_select.map((tag: Tag) => {
        return {
          id: tag.id,
          name: tag.name,
        };
      }),
    };
  }
}
