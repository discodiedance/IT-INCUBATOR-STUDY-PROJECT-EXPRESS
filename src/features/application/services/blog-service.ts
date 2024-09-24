import { inject, injectable } from "inversify";

import { PostService } from "./post-service";

import { OutputBlogType } from "../../../types/blog/output";
import { OutputPostType } from "../../../types/post/output";
import { BlogModel } from "../../domain/entities/blog-entity";
import { QueryBlogRepository } from "../../infrastructure/repositories/query-repository/query-blog-repository";
import { BlogRepository } from "../../infrastructure/repositories/blog-repository";
import { BlogDocumentType } from "../../../types/blog/blog-entities";
import {
  CreateBlogDataType,
  UpdateBlogDataType,
} from "../../../types/blog/blog-dto";
import { blogMapper } from "../mappers/blog/blog-mapper";

@injectable()
export class BlogService {
  constructor(
    @inject(PostService) protected PostService: PostService,
    @inject(BlogRepository) protected BlogRepository: BlogRepository,
    @inject(QueryBlogRepository)
    protected QueryBlogRepository: QueryBlogRepository
  ) {}

  async createBlog(newBlog: CreateBlogDataType): Promise<OutputBlogType> {
    const createdBlog = BlogModel.createBlog(newBlog);
    await this.BlogRepository.save(createdBlog);
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
    const blog = await this.BlogRepository.getBlogByBlogId(blogId);

    if (!blog) {
      return null;
    }

    const post = await this.PostService.createPost({
      ...postData,
      blogId,
      blogName: blog.name,
    });

    return post;
  }

  async updateBlog(
    blog: BlogDocumentType,
    updateData: UpdateBlogDataType
  ): Promise<boolean> {
    blog.updateBlog(updateData);
    const updatedBlog = await this.BlogRepository.save(blog);
    if (!updatedBlog) {
      return false;
    }
    return true;
  }
}
