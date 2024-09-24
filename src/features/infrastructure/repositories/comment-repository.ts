import { injectable } from "inversify";
import { CommentModel } from "../../domain/entities/comment-enitity";
import { CommentDocumentType } from "../../../types/comment/comment-entities";

@injectable()
export class CommentRepository {
  async save(model: CommentDocumentType) {
    return await model.save();
  }

  async deleteComment(id: string): Promise<boolean> {
    const result = await CommentModel.deleteOne({ id: id });

    return !!result.deletedCount;
  }

  async getCommentByCommentId(
    commentId: string
  ): Promise<CommentDocumentType | null> {
    const comment = await CommentModel.findOne({
      id: commentId,
    });
    if (!comment) {
      return null;
    }
    return comment;
  }
}
