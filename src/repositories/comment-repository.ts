import { CommentModel } from "../db/db";
import { UpdateCommentData } from "../types/comment/input";

export class CommentRepository {
  static async updateComment(id: string, updateData: UpdateCommentData) {
    const result = await CommentModel.updateOne(
      { id: id },
      {
        $set: {
          content: updateData.content,
        },
      }
    );
    return !!result.modifiedCount;
  }

  static async deleteComment(id: string): Promise<boolean> {
    const result = await CommentModel.deleteOne({ id: id });

    return !!result.deletedCount;
  }
}
