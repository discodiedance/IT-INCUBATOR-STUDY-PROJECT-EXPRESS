import { QueryBlogRepository } from "../repositories/query-repository/query-blog-repository";
import { BlogRepository } from "../repositories/blog-repositry";

import { PostService } from "./post-service";
import { blogMapper } from "./../middlewares/blog/blog-mapper";

import { ObjectId } from "mongodb";

import { InputBlogBodyType } from "../types/blog/input";
import { BlogDBType, OutputBlogType } from "../types/blog/output";
import { OutputPostType } from "../types/post/output";

export class BlogService {
  constructor(
    protected PostService: PostService,
    protected BlogRepository: BlogRepository,
    protected QueryBlogRepository: QueryBlogRepository
  ) {}

  async createBlog(newBlog: InputBlogBodyType): Promise<OutputBlogType> {
    const createdBlog = new BlogDBType(
      new ObjectId().toString(),
      newBlog.name,
      newBlog.description,
      newBlog.websiteUrl,
      new Date().toISOString(),
      false
    );

    await this.BlogRepository.createBlog(createdBlog);

    return blogMapper(createdBlog);
  }

  async createPostToBlog(
    blogId: string,
    postData: {
      title: string;
      shortDescription: string;
      content: string;
    }
  ): Promise<OutputPostType | null> {
    const blog = await this.QueryBlogRepository.getBlogById(blogId);

    if (!blog) {
      return null;
    }

    const post = await this.PostService.createPost({
      ...postData,
      blogId,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    });

    return post;
  }

  async updateBlog(
    id: string,
    updateData: InputBlogBodyType
  ): Promise<boolean> {
    const updatedBlog = new InputBlogBodyType(
      updateData.name,
      updateData.description,
      updateData.websiteUrl
    );

    const result = await this.BlogRepository.updateBlog(id, updatedBlog);
    return result;
  }
}
