import { CommentRepository } from "../repositories/comment-repository";
import { UpdateCommentData } from "../types/comment/input";
import { OutputCommentType } from "../types/comment/output";
import { OutputUserType } from "../types/user/output";

export class CommentService {
  static async updateComment(
    id: string,
    updateData: UpdateCommentData
  ): Promise<boolean> {
    const updatedComment: UpdateCommentData = {
      content: updateData.content,
    };
    const result = await CommentRepository.updateComment(id, updatedComment);
    return !!result.modifiedCount;
  }
  static async checkCredentials(
    comment: OutputCommentType,
    user: OutputUserType | null
  ): Promise<boolean | null> {
    if (
      comment.commentatorInfo.userId !== user!.userId &&
      comment.commentatorInfo.userLogin !== user!.login
    ) {
      return null;
    }
    return true;
  }
}
