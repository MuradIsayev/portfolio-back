import { Injectable } from '@nestjs/common';
import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { Blogs } from './types';

@Injectable()
export class NotionService {
  private readonly client: Client;
  private readonly notionToMarkdown: NotionToMarkdown;

  constructor() {
    this.client = new Client({ auth: process.env.NOTION_ACCESS_TOKEN });
    this.notionToMarkdown = new NotionToMarkdown({ notionClient: this.client });
  }

  async getPublishedPosts(): Promise<Blogs[]> {
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

  private static pageToPostTransformer(page: any): Blogs {
    return {
      id: page.id,
      title: page.properties.Title.title[0].plain_text,
      description: page.properties.Preview.rich_text[0].plain_text,
      slug: page.properties.Slug.formula.string,
      date: page.properties.Date.date,
      tags: page.properties.Tags.multi_select,
      author: page.properties.Author.people[0].person,
    };
  }
}
