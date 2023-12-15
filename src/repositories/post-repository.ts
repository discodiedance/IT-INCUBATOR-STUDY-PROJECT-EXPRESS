import { ObjectId } from "mongodb";
import { postCollection } from "../db/db";
import { InputPostType, UpdatePostData } from "../types/post/input";
import { PostService } from "../domain/post-service";

export class PostRepository {
  static async createPost(newPost: InputPostType) {
    const post = await PostService.createPost(newPost);
    return post;
  }

  static async updatePost(id: string, updatedPost: UpdatePostData) {
    const post = await PostService.updatePost(id, updatedPost);
    return post;
  }

  static async deletePost(id: string): Promise<boolean> {
    const result = await postCollection.deleteOne({ _id: new ObjectId(id) });

    return !!result.deletedCount;
  }
}
