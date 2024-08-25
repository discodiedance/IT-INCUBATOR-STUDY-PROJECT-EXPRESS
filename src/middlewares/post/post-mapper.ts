import { PostDBType } from "../../types/post/input";
import { OutputPostType } from "../../types/post/output";

export const postMapper = (post: PostDBType): OutputPostType => {
  return {
    postId: post.id,
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
  };
};
