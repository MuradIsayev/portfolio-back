export type Tag = {
  id: string;
  name: string;
};

export type Blog = {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  fromNow: string;
  viewCount: number;
  tags: Tag[];
  minsRead: number;
};

export type SingleBlog = {
  post: Blog;
  markdown: string;
};
