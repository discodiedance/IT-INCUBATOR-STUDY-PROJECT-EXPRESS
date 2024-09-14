import { CommentModel } from "../../db/db";
import {
  commentMapper,
  commentMapperWithStatus,
} from "../../middlewares/comment/comment-mapper";
import {
  CommentDBType,
  OutputCommentType,
  OutputCommentTypeWithStatus,
} from "../../types/comment/output";

export class QueryCommentRepository {
  async getCommentById(commentId: string): Promise<OutputCommentType | null> {
    const comment: CommentDBType | null = await CommentModel.findOne({
      id: commentId,
    });
    if (!comment) {
      return null;
    }
    return commentMapper(comment);
  }

  async getCommentByIdWithStatus(
    commentId: string,
    userId: string
  ): Promise<OutputCommentTypeWithStatus | null> {
    const comment: CommentDBType | null = await CommentModel.findOne({
      id: commentId,
    });
    if (!comment) {
      return null;
    }
    return await commentMapperWithStatus(comment, userId);
  }
}
