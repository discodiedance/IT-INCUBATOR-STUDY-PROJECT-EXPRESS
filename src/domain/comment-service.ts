import { CommentRepository } from "../repositories/comment-repository";
import { UpdateCommentData } from "../types/comment/input";

// type Result<T> = {
//   status: number;
//   isSuccess: boolean;
//   data: T;
// };

export class CommentService {
  static async updateComment(
    id: string,
    updateData: UpdateCommentData
  ): Promise<boolean> {
    //getConnemt
    //if !comment return {status 404, isSuccess: false}

    const updatedComment: UpdateCommentData = {
      content: updateData.content,
    };
    const result = await CommentRepository.updateComment(id, updatedComment);
    return !!result.matchedCount;
  }
}
