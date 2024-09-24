import { injectable } from "inversify";

import { PostDocumentType } from "../../../types/post/post-entities";
import { PostModel } from "../../domain/entities/post-entity";

@injectable()
export class PostRepository {
  async save(model: PostDocumentType) {
    return await model.save();
  }

  async deletePost(id: string): Promise<boolean> {
    const result = await PostModel.deleteOne({ id: id });
    return !!result.deletedCount;
  }

  async getPostByPostId(postId: string): Promise<PostDocumentType | null> {
    const post = await PostModel.findOne({
      id: postId,
    });
    if (!post) {
      return null;
    }
    return post;
  }
}
