import { WithId } from "mongodb";
import { CommentType, OutputCommentType } from "../../types/comment/output";

export const commentMapper = (
  comment: WithId<CommentType>
): OutputCommentType => {
  return {
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: comment.commentatorInfo,
    createdAt: comment.createdAt,
  };
};
