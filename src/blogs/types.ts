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
  tags: Tag[];
};
