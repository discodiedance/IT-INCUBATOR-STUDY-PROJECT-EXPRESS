import { QueryBlogRepository } from "../repositories/query-repository/query-blog-repository";
import { InputBlogBodyType } from "../types/blog/input";
import { BlogDBType, OutputBlogType } from "../types/blog/output";
import { BlogRepository } from "../repositories/blog-repositry";
import { PostService } from "./post-service";
import { ObjectId } from "mongodb";
import { blogMapper } from "./../middlewares/blog/blog-mapper";
import { OutputPostType } from "../types/post/output";

export class BlogService {
  static async createBlog(newBlog: InputBlogBodyType): Promise<OutputBlogType> {
    const createdBlog: BlogDBType = {
      id: new ObjectId().toString(),
      name: newBlog.name,
      description: newBlog.description,
      websiteUrl: newBlog.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };

    await BlogRepository.createBlog(createdBlog);

    return blogMapper(createdBlog);
  }

  static async createPostToBlog(
    blogId: string,
    postData: {
      title: string;
      shortDescription: string;
      content: string;
    }
  ): Promise<OutputPostType | null> {
    const blog = await QueryBlogRepository.getBlogById(blogId);

    if (!blog) {
      return null;
    }

    const post = await PostService.createPost({
      ...postData,
      blogId,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    });

    return post;
  }

  static async updateBlog(
    id: string,
    updateData: InputBlogBodyType
  ): Promise<boolean> {
    const updatedBlog: InputBlogBodyType = {
      name: updateData.name,
      description: updateData.description,
      websiteUrl: updateData.websiteUrl,
    };
    const result: boolean = await BlogRepository.updateBlog(id, updatedBlog);
    return result;
  }
}
