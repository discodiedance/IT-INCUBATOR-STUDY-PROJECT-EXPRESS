import { CommentDBType, OutputCommentType } from "../../types/comment/output";
import { CommentModel } from "../../db/db";
import { commentMapper } from "../../middlewares/comment/comment-mapper";

export class QueryCommentRepository {
  static async getCommentById(id: string): Promise<OutputCommentType | null> {
    if (!id) return null;

    const comment: CommentDBType | null = await CommentModel.findOne({
      id: id,
    });
    if (!comment) {
      return null;
    }
    return commentMapper(comment);
  }
}
