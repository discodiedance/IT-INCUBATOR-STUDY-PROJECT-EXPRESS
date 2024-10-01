import { injectable } from "inversify";
import { CommentLikesDocumentType } from "../../../types/likes/comment-likes/comment-likes-entities";
import { CommentLikesModel } from "../../domain/entities/commen-likes-entity";

@injectable()
export class CommentLikesRepository {
  async save(model: CommentLikesDocumentType) {
    return await model.save();
  }

  async deleteLikeOrDislike(id: string): Promise<boolean> {
    const result = await CommentLikesModel.deleteOne({ id: id });
    return !!result.deletedCount;
  }

  async getLikeDataByParentIdAndCommentId(
    parentId: string | null,
    commentId: string
  ): Promise<CommentLikesDocumentType | null> {
    const likeData = await CommentLikesModel.findOne({
      parentId: parentId,
      commentId: commentId,
    });
    if (!likeData) {
      return null;
    }
    return likeData;
  }

  async getCommentLikeStatusForUser(
    userId: string | null,
    commentId: string
  ): Promise<string> {
    const likeData = await CommentLikesModel.findOne({
      commentId: commentId,
      parentId: userId,
    });
    if (!likeData) {
      return "None";
    }
    return likeData.status;
  }
}
