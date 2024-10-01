import { injectable } from "inversify";
import { PostLikesDocumentType } from "../../../types/likes/post-likes/post-likes-entities";
import { PostLikesModel } from "../../domain/entities/post-likes-entity";

@injectable()
export class PostLikesRepository {
  async save(model: PostLikesDocumentType) {
    return await model.save();
  }

  async getThreeLastLikes(postId: string) {
    const lastThreeLikes = await PostLikesModel.find({
      postId: postId,
    })
      .where("isDeleted")
      .equals(false)
      .where("isFirstReaction")
      .equals(true)
      .where("status")
      .equals("Like")
      .sort({ createdAt: -1 })
      .limit(3)
      .then((likes) => {
        return likes.map((like) => ({
          addedAt: like.createdAt,
          userId: like.parentId,
          login: like.parentLogin,
        }));
      });
    if (lastThreeLikes.length === 0) {
      return [];
    }

    return lastThreeLikes;
  }

  async getLikeDataByParentIdAndPostId(
    parentId: string,
    postId: string
  ): Promise<PostLikesDocumentType | null> {
    const likeData = await PostLikesModel.findOne({
      parentId: parentId,
      postId: postId,
    });
    if (!likeData) {
      return null;
    }
    return likeData;
  }

  async getPostLikeStatusForUser(
    parentId: string | null,
    postId: string
  ): Promise<string> {
    const likeData = await PostLikesModel.findOne({
      parentId: parentId,
      postId: postId,
    });
    if (!likeData) {
      return "None";
    }
    return likeData.status;
  }
}
