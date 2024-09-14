import { CommentLikesModel } from "../db/db";
import { InputCreateLikeData } from "../types/like/input";
import { CommentLikesDBType } from "../types/like/output";

export class LikeRepository {
  async createLikeOrDislike(
    inputCreateLikeData: InputCreateLikeData
  ): Promise<CommentLikesDBType | null> {
    const createdLike: CommentLikesDBType | null =
      await CommentLikesModel.create(inputCreateLikeData);
    return createdLike;
  }

  async updateLikeStatus(status: string, id: string) {
    const result = await CommentLikesModel.updateOne(
      {
        id: id,
      },
      {
        $set: {
          createdAt: new Date(),
          status: status,
        },
      }
    );
    return !!result.modifiedCount;
  }

  async deleteLikeOrDislike(id: string) {
    const result = await CommentLikesModel.deleteOne({ id: id });
    return !!result.deletedCount;
  }
}
