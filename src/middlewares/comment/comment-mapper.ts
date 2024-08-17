import { CommentDBType, OutputCommentType } from "../../types/comment/output";

export const commentMapper = (comment: CommentDBType): OutputCommentType => {
  return {
    commentId: comment.id,
    content: comment.content,
    commentatorInfo: comment.commentatorInfo,
    createdAt: comment.createdAt,
  };
};
