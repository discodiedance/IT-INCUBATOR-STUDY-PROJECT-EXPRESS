import { ObjectId } from "mongodb";
import { commentCollection } from "../db/db";
import { UpdateCommentData } from "../types/comment/input";

export class CommentRepository {
  static async updateComment(id: string, updateData: UpdateCommentData) {
    const result = await commentCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          content: updateData.content,
        },
      }
    );
    return result;
  }

  static async deleteComment(id: string): Promise<boolean> {
    const result = await commentCollection.deleteOne({ _id: new ObjectId(id) });

    return !!result.deletedCount;
  }
}
