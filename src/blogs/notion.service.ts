import { Injectable, NotFoundException } from '@nestjs/common';
import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { Blog, SingleBlogPage, Tag } from './types';
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

  async getSinglePost(slug: string): Promise<SingleBlogPage> {
    let post, markdown;

    const databaseID = process.env.NOTION_BLOG_DATABASE_ID || '';

    const response = await this.client.databases.query({
      database_id: databaseID,
      filter: {
        property: 'Slug',
        formula: {
          string: {
            equals: slug,
          },
        },
      },
    });

    if (response.results.length === 0) {
      throw new NotFoundException('Post not found');
    }

    const page = response.results[0];

    const mdBlocks = await this.notionToMarkdown.pageToMarkdown(page.id);
    markdown = this.notionToMarkdown.toMarkdownString(mdBlocks);
    post = NotionService.pageToPostTransformer(page);

    return {
      post,
      markdown,
    };
  }

  async updateViewCount(slug: string): Promise<void> {
    const databaseID = process.env.NOTION_BLOG_DATABASE_ID || '';
    const response = await this.client.databases.query({
      database_id: databaseID,
      filter: {
        property: 'Slug',
        formula: {
          string: {
            equals: slug,
          },
        },
      },
    });

    if (response.results.length === 0) {
      throw new NotFoundException('Post not found');
    }

    const page = response.results[0];

    const viewCount = NotionService.viewCountTransformer(page);

    await this.client.pages.update({
      page_id: page.id,
      properties: {
        Views: {
          number: viewCount + 1,
        },
      },
    });
  }

  private static viewCountTransformer(page: any): number {
    return page.properties.Views.number;
  }

  private static pageToPostTransformer(page: any): Blog {
    const formattedDate = dayjs(page.properties.Date.created_time).format(
      'MMMM D, YYYY',
    );

    const fromNow = dayjs(page.properties.Date.created_time).fromNow();

    return {
      id: page.id,
      title: page.properties.Title.title[0].plain_text,
      slug: page.properties.Slug.formula.string,
      createdAt: formattedDate,
      fromNow: fromNow,
      viewCount: page.properties.Views.number,
      tags: page.properties.Tags.multi_select.map((tag: Tag) => {
        return {
          id: tag.id,
          name: tag.name,
        };
      }),
    };
  }
}
