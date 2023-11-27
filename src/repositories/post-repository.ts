import { ObjectId } from "mongodb";
import { postCollection } from "../db/db";
import { OutputPostType, PostType } from "../types/post/output";
import { InputPostType, UpdatePostData } from "../types/post/input";
import { postMapper } from "../middlewares/post/post-mapper";

export class PostRepository {
  static async getAllPosts() {
    const posts = await postCollection.find({}).toArray();
    return posts.map(postMapper);
  }

  static async getPostById(id: string): Promise<OutputPostType | null> {
    const post = await postCollection.findOne({ _id: new ObjectId(id) });
    if (!post) {
      return null;
    }
    return postMapper(post);
  }

  static async createPost(newPost: InputPostType): Promise<PostType> {
    const createdPost: PostType = {
      title: newPost.title,
      shortDescription: newPost.shortDescription,
      content: newPost.content,
      blogId: newPost.blogId,
      blogName: newPost.blogName,
      createdAt: new Date().toISOString(),
    };

    const result = await postCollection.insertOne({ ...createdPost });
    createdPost.id = result.insertedId.toString();
    return createdPost;
  }

  static async updatePost(
    id: string,
    updateData: UpdatePostData
  ): Promise<boolean> {
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

    return !!result.matchedCount;
  }

  static async deletePost(id: string): Promise<boolean> {
    const result = await postCollection.deleteOne({ _id: new ObjectId(id) });

    return !!result.deletedCount;
  }
}
