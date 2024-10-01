import { injectable } from "inversify";

import { OutputCommentTypeWithStatus } from "../../../../types/comment/output";
import { CommentModel } from "../../../domain/entities/comment-enitity";
import { CommentDocumentType } from "../../../../types/comment/comment-entities";
import { commentMapper } from "../../../application/mappers/comment/comment-mapper";

@injectable()
export class QueryCommentRepository {
  async getMappedCommentByCommentIdWithStatus(
    commentId: string,
    userId: string | null
  ): Promise<OutputCommentTypeWithStatus | null> {
    const comment: CommentDocumentType | null = await CommentModel.findOne({
      id: commentId,
    });
    if (!comment) {
      return null;
    }
    return await commentMapper(comment, userId);
  }
}
