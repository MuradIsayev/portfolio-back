export type Tag = {
  id: string;
  name: string;
};

export type Blogs = {
  id: string;
  title: string;
  description: string;
  slug: string;
  date: string;
  tags: Tag[];
  author: string;
};
