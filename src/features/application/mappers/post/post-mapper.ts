import { OutputPostType } from "../../../../types/post/output";
import { PostDocumentType } from "../../../../types/post/post-entities";

export const postMapper = (post: PostDocumentType): OutputPostType => {
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
