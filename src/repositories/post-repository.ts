import { ObjectId } from "mongodb";
import { commentCollection, postCollection } from "../db/db";
import { UpdatePostData } from "../types/post/input";
import { PostType } from "../types/post/output";
import { CommentType } from "../types/comment/output";

export class PostRepository {
  static async createPost(inputCreatePost: PostType) {
    const createdPost = await postCollection.insertOne({ ...inputCreatePost });
    inputCreatePost.id = createdPost.insertedId.toString();
    return createdPost;
  }

  static async createComment(inputCreateComment: CommentType) {
    const result = await commentCollection.insertOne({
      ...inputCreateComment,
    });
    inputCreateComment.id = result.insertedId.toString();
    return inputCreateComment;
  }

  static async updatePost(id: string, updateData: UpdatePostData) {
    const result = await postCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: updateData.title,
          shortDescription: updateData.shortDescription,
          content: updateData.content,
          blogId: updateData.blogId,
        },
      }
    );
    return result;
  }

  static async deletePost(id: string): Promise<boolean> {
    const result = await postCollection.deleteOne({ _id: new ObjectId(id) });

    return !!result.deletedCount;
  }
}
