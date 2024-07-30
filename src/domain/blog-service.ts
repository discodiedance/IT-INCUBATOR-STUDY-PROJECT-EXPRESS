import { QueryBlogRepository } from "../repositories/query-repository/query-blog-repository";
import { InputBlogType, UpdateBlogData } from "../types/blog/input";
import { BlogType } from "../types/blog/output";
import { BlogRepository } from "../repositories/blog-repositry";
import { PostService } from "./post-service";

export class BlogService {
  static async createBlog(newBlog: InputBlogType): Promise<BlogType> {
    const createdBlog: BlogType = {
      name: newBlog.name,
      description: newBlog.description,
      websiteUrl: newBlog.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };

    await BlogRepository.createBlog(createdBlog);
    return createdBlog;
  }

  static async createPostToBlog(
    blogId: string,
    postData: {
      title: string;
      shortDescription: string;
      content: string;
    }
  ) {
    const blog = await QueryBlogRepository.getBlogById(blogId);

    if (!blog) {
      return null;
    }

    const post = await PostService.createPost({
      ...postData,
      blogId,
      blogName: blog.name,
    });

    return post;
  }

  static async updateBlog(
    id: string,
    updateData: UpdateBlogData
  ): Promise<boolean> {
    const updatedBlog: UpdateBlogData = {
      name: updateData.name,
      description: updateData.description,
      websiteUrl: updateData.websiteUrl,
    };
    const result = await BlogRepository.updateBlog(id, updatedBlog);
    return !!result.matchedCount;
  }
}
