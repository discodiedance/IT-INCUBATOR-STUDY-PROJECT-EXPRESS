import { CommentRepository } from "../repositories/comment-repository";
import { UpdateCommentData } from "../types/comment/input";

export class CommentService {
  static async updateComment(
    id: string,
    updateData: UpdateCommentData
  ): Promise<boolean> {
    const updatedComment: UpdateCommentData = {
      content: updateData.content,
    };
    const result = await CommentRepository.updateComment(id, updatedComment);
    return !!result.matchedCount;
  }
}
