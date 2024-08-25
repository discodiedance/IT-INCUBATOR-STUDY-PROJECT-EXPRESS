import { CommentModel, PostModel } from "../db/db";
import { UpdatePostData } from "../types/post/input";
import { PostDBType } from "../types/post/input";
import { CommentDBType } from "../types/comment/output";

export class PostRepository {
  static async createPost(inputCreatePost: PostDBType): Promise<PostDBType> {
    const createdPost = await PostModel.create(inputCreatePost);
    return createdPost;
  }

  static async createComment(
    inputCreateComment: CommentDBType
  ): Promise<CommentDBType> {
    const result: CommentDBType = await CommentModel.create(inputCreateComment);
    return result;
  }

  static async updatePost(
    id: string,
    updateData: UpdatePostData
  ): Promise<boolean> {
    const result = await PostModel.updateOne(
      { id: id },
      {
        $set: {
          title: updateData.title,
          shortDescription: updateData.shortDescription,
          content: updateData.content,
          blogId: updateData.blogId,
        },
      }
    );
    return !!result.modifiedCount;
  }

  static async deletePost(id: string): Promise<boolean> {
    const result = await PostModel.deleteOne({ id: id });
    return !!result.deletedCount;
  }
}
