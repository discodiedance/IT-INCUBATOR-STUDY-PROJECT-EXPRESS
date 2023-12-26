import { ObjectId } from "mongodb";
import { OutputCommentType } from "../../types/comment/output";
import { commentCollection } from "../../db/db";
import { commentMapper } from "../../middlewares/comment/comment-mapper";

export class QueryCommentRepository {
  static async getCommentById(id: string): Promise<OutputCommentType | null> {
    if (!ObjectId.isValid(id)) return null;

    const comment = await commentCollection.findOne({ _id: new ObjectId(id) });
    if (!comment) {
      return null;
    }
    return commentMapper(comment);
  }
}
