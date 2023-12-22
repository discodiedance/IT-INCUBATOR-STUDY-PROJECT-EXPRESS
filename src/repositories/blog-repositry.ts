import { ObjectId } from "mongodb";
import { blogCollection } from "../db/db";
import { UpdateBlogData } from "../types/blog/input";
import { BlogType } from "../types/blog/output";

export class BlogRepository {
  static async createBlog(inputCreateBlog: BlogType) {
    const createdBlog = await blogCollection.insertOne({ ...inputCreateBlog });
    inputCreateBlog.id = createdBlog.insertedId.toString();
    return createdBlog;
  }

  static async updateBlog(id: string, updateData: UpdateBlogData) {
    const result = await blogCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: updateData.name,
          description: updateData.description,
          websiteUrl: updateData.websiteUrl,
        },
      }
    );
    return result;
  }

  static async deleteBlog(id: string): Promise<boolean> {
    const result = await blogCollection.deleteOne({ _id: new ObjectId(id) });

    return !!result.deletedCount;
  }
}
