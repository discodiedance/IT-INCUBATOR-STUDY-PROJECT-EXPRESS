import { commentLikesRepository } from "../../../../routes/composition-root";
import { CommentDocumentType } from "../../../../types/comment/comment-entities";
import { OutputCommentTypeWithStatus } from "../../../../types/comment/output";

export const commentMapper = async (
  comment: CommentDocumentType,
  userId: string | null
): Promise<OutputCommentTypeWithStatus> => {
  return {
    id: comment.id,
    content: comment.content,
    commentatorInfo: comment.commentatorInfo,
    createdAt: comment.createdAt,
    likesInfo: {
      likesCount: comment.likesInfo.likesCount,
      dislikesCount: comment.likesInfo.dislikesCount,
      myStatus: await commentLikesRepository.getCommentLikeStatusForUser(
        userId,
        comment.id
      ),
    },
  };
};
