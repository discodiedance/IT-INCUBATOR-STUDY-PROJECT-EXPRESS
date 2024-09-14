import { CommentModel } from "../db/db";
import { UpdateCommentData } from "../types/comment/input";

export class CommentRepository {
  async updateComment(id: string, updateData: UpdateCommentData) {
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

  async deleteComment(id: string): Promise<boolean> {
    const result = await CommentModel.deleteOne({ id: id });

    return !!result.deletedCount;
  }

  async updateCommentLikeCounterAdd(id: string) {
    const result = await CommentModel.updateOne(
      { id: id },
      {
        $inc: {
          "likesInfo.likesCount": 1,
        },
      }
    );
    return !!result.modifiedCount;
  }

  async updateCommentDislikeCounterAdd(id: string) {
    const result = await CommentModel.updateOne(
      { id: id },
      {
        $inc: {
          "likesInfo.dislikesCount": 1,
        },
      }
    );
    return !!result.modifiedCount;
  }

  async updateCommentLikeCounterRemove(id: string) {
    const result = await CommentModel.updateOne(
      { id: id },
      {
        $inc: {
          "likesInfo.likesCount": -1,
        },
      }
    );
    return !!result.modifiedCount;
  }

  async updateCommentDislikeCounterRemove(id: string) {
    const result = await CommentModel.updateOne(
      { id: id },
      {
        $inc: {
          "likesInfo.dislikesCount": -1,
        },
      }
    );
    return !!result.modifiedCount;
  }
}
