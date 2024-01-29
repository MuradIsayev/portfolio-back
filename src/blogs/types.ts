export type Tag = {
  id: string;
  name: string;
};

export type Blog = {
  id: string;
  title: string;
  description: string;
  slug: string;
  createdAt: string;
  viewCount: number;
  tags: Tag[];
  minsRead: number;
};

export type SingleBlog = {
  post: Blog;
  markdown: string;
};
