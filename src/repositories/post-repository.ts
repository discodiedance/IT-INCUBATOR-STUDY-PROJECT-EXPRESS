import { CommentModel, PostModel } from "../db/db";
import { UpdatePostData } from "../types/post/input";
import { CommentDBType } from "../types/comment/output";
import { PostDBType } from "../types/post/output";
import { CreateCommentData } from "../types/comment/input";

export class PostRepository {
  async createPost(inputCreatePost: PostDBType): Promise<PostDBType> {
    const createdPost = await PostModel.create(inputCreatePost);
    return createdPost;
  }

  async createComment(
    inputCreateComment: CreateCommentData
  ): Promise<CommentDBType> {
    const result = await CommentModel.create(inputCreateComment);
    return result;
  }

  async updatePost(id: string, updateData: UpdatePostData): Promise<boolean> {
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

  async deletePost(id: string): Promise<boolean> {
    const result = await PostModel.deleteOne({ id: id });
    return !!result.deletedCount;
  }
}
