import { ObjectId } from "mongodb";
import { blogCollection } from "../db/db";
import { InputBlogType, UpdateBlogData } from "../types/blog/input";
import { BlogService } from "../domain/blog-service";

export class BlogRepository {
  static async createBlog(newBlog: InputBlogType) {
    const blog = await BlogService.createBlog(newBlog);
    return blog;
  }

  static async updateBlog(id: string, updatedBlog: UpdateBlogData) {
    const blog = await BlogService.updateBlog(id, updatedBlog);
    return blog;
  }

  static async deleteBlog(id: string): Promise<boolean> {
    const result = await blogCollection.deleteOne({ _id: new ObjectId(id) });

    return !!result.deletedCount;
  }
}
