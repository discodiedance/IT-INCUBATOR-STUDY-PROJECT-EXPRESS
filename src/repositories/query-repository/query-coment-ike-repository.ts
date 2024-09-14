import { CommentLikesModel } from "../../db/db";
import { CommentLikesDBType } from "../../types/like/output";

export class QueryCommentLikeRepository {
  async findLikeDataByParentIdAndCommentId(
    parentId: string,
    commentId: string
  ): Promise<CommentLikesDBType | null> {
    const likeData: CommentLikesDBType | null = await CommentLikesModel.findOne(
      {
        parentId: parentId,
        commentId: commentId,
      }
    );
    if (!likeData) {
      return null;
    }
    return likeData;
  }
}
