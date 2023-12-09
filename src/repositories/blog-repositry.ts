import { ObjectId } from "mongodb";
import { blogCollection } from "../db/db";
import { BlogType } from "../types/blog/output";
import { InputBlogType, UpdateBlogData } from "../types/blog/input";

export class BlogRepository {
  static async createBlog(newBlog: InputBlogType): Promise<BlogType> {
    const createdBlog: BlogType = {
      name: newBlog.name,
      description: newBlog.description,
      websiteUrl: newBlog.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };

    const result = await blogCollection.insertOne({ ...createdBlog });
    createdBlog.id = result.insertedId.toString();
    return createdBlog;
  }

  static async updateBlog(
    id: string,
    updateData: UpdateBlogData
  ): Promise<boolean> {
    const result = await blogCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: updateData.name,
          description: updateData.description,
          webisteUrl: updateData.websiteUrl,
        },
      }
    );

    return !!result.matchedCount;
  }

  static async deleteBlog(id: string): Promise<boolean> {
    const result = await blogCollection.deleteOne({ _id: new ObjectId(id) });

    return !!result.deletedCount;
  }
}
