import { postLikesRepository } from "../../../../routes/composition-root";
import { OutputPostTypeWithStatus } from "../../../../types/post/output";
import { PostDocumentType } from "../../../../types/post/post-entities";

export const postMapper = async (
  post: PostDocumentType,
  userId: string | null
): Promise<OutputPostTypeWithStatus> => {
  return {
    id: post.id,
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
    extendedLikesInfo: {
      likesCount: post.likesInfo.likesCount,
      dislikesCount: post.likesInfo.dislikesCount,
      myStatus: await postLikesRepository.getPostLikeStatusForUser(
        userId,
        post.id
      ),
      newestLikes: await postLikesRepository.getThreeLastLikes(post.id),
    },
  };
};
