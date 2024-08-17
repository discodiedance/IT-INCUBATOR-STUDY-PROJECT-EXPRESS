export type PostDBType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};

export type OutputPostType = {
  postId: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};

export type CreatePostToBlogType = {
  content: string;
  shortDescription: string;
  title: string;
};
