import { injectable } from "inversify";

import {
  OutputCommentType,
  OutputCommentTypeWithStatus,
} from "../../../../types/comment/output";
import { CommentModel } from "../../../domain/entities/comment-enitity";
import { CommentDocumentType } from "../../../../types/comment/comment-entities";
import {
  commentMapper,
  commentMapperWithStatus,
} from "../../../application/mappers/comment/comment-mapper";

@injectable()
export class QueryCommentRepository {
  async getMappedCommentByCommentId(
    commentId: string
  ): Promise<OutputCommentType | null> {
    const comment: CommentDocumentType | null = await CommentModel.findOne({
      id: commentId,
    });
    if (!comment) {
      return null;
    }
    return commentMapper(comment);
  }

  async getCommentByCommentIdWithStatus(
    commentId: string,
    userId: string
  ): Promise<OutputCommentTypeWithStatus | null> {
    const comment: CommentDocumentType | null = await CommentModel.findOne({
      id: commentId,
    });
    if (!comment) {
      return null;
    }
    return await commentMapperWithStatus(comment, userId);
  }
}
