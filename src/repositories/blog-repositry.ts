import { BlogModel } from "../db/db";
import { InputBlogBodyType } from "../types/blog/input";
import { BlogDBType } from "../types/blog/output";

export class BlogRepository {
  static async createBlog(inputCreateBlog: BlogDBType): Promise<BlogDBType> {
    const createdBlog = await BlogModel.create(inputCreateBlog);
    return createdBlog;
  }

  static async updateBlog(
    id: string,
    updateData: InputBlogBodyType
  ): Promise<boolean> {
    const result = await BlogModel.updateOne(
      { id: id },
      {
        $set: {
          name: updateData.name,
          description: updateData.description,
          websiteUrl: updateData.websiteUrl,
        },
      }
    );
    return !!result.modifiedCount;
  }

  static async deleteBlog(id: string): Promise<boolean> {
    const result = await BlogModel.deleteOne({ id: id });

    return !!result.deletedCount;
  }
}
