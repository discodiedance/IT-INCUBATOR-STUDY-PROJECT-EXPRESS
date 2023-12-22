import { ObjectId } from "mongodb";
import { postCollection } from "../db/db";
import { UpdatePostData } from "../types/post/input";
import { PostType } from "../types/post/output";

export class PostRepository {
  static async createPost(inputCreatePost: PostType) {
    const createdPost = await postCollection.insertOne({ ...inputCreatePost });
    inputCreatePost.id = createdPost.insertedId.toString();
    return createdPost;
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
