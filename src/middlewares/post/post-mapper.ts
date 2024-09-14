import { OutputPostType, PostDBType } from "../../types/post/output";

export const postMapper = (post: PostDBType): OutputPostType => {
  return {
    id: post.id,
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
  };
};
