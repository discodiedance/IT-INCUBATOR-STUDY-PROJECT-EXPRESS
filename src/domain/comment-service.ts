import { CommentRepository } from "../repositories/comment-repository";

import { UpdateCommentData } from "../types/comment/input";
import { OutputCommentType } from "../types/comment/output";
import { OutputUserType } from "../types/user/output";

export class CommentService {
  constructor(protected CommentRepository: CommentRepository) {}
  async updateComment(
    updateData: UpdateCommentData,
    id: string
  ): Promise<boolean> {
    const updatedComment = new UpdateCommentData(updateData.content);

    const result = await this.CommentRepository.updateComment(
      id,
      updatedComment
    );
    return result;
  }

  async checkCredentials(
    comment: OutputCommentType,
    user: OutputUserType
  ): Promise<boolean | null> {
    if (
      comment.commentatorInfo.userId !== user.id &&
      comment.commentatorInfo.userLogin !== user.login
    ) {
      return null;
    }
    return true;
  }
}
