import { Response } from "express";
import { inject, injectable } from "inversify";

import { BlogService } from "../features/application/services/blog-service";

import { InputBlogDataType, InputBlogSortDataType } from "../types/blog/input";
import {
  RequestTypeWithQuery,
  RequestWithParams,
  Params,
  RequestTypeWithQueryBlogId,
  BlogIdParams,
  RequestWithBody,
  RequestWithBodyAndParams,
} from "../types/common";
import { QueryBlogRepository } from "../features/infrastructure/repositories/query-repository/query-blog-repository";
import { QueryPostRepository } from "../features/infrastructure/repositories/query-repository/query-post-repository";
import { BlogRepository } from "../features/infrastructure/repositories/blog-repository";
import { BlogSortDataType } from "../types/blog/blog-dto";
import {
  InputCreatePostToBlogDataType,
  InputPostSortDataType,
} from "../types/post/input";
import { PostSortDataType } from "../types/post/post-dto";

@injectable()
export class BlogController {
  constructor(
    @inject(BlogService) protected BlogService: BlogService,
    @inject(QueryBlogRepository)
    protected QueryBlogRepository: QueryBlogRepository,
    @inject(BlogRepository) protected BlogRepository: BlogRepository,
    @inject(QueryPostRepository)
    protected QueryPostRepository: QueryPostRepository
  ) {}

  async getAllBlogs(
    req: RequestTypeWithQuery<InputBlogSortDataType>,
    res: Response
  ) {
    const sortData: BlogSortDataType = {
      searchNameTerm: req.query.searchNameTerm,
      sortBy: req.query.sortBy,
      sortDirection: req.query.sortDirection,
      pageNumber: req.query.pageNumber,
      pageSize: req.query.pageSize,
    };
    const blogs = await this.QueryBlogRepository.getAllBlogs(sortData);

    return res.send(blogs);
  }

  async getBlogByBlogId(req: RequestWithParams<Params>, res: Response) {
    const id = req.params.id;
    const blog = await this.QueryBlogRepository.getMappedBlogById(id);

    if (!blog) {
      res.sendStatus(404);
      return;
    }
    return res.send(blog);
  }

  async getAllPostsFromBlog(
    req: RequestTypeWithQueryBlogId<InputPostSortDataType, BlogIdParams>,
    res: Response
  ) {
    const sortData: PostSortDataType = {
      pageNumber: req.query.pageNumber,
      pageSize: req.query.pageSize,
      sortBy: req.query.sortBy,
      sortDirection: req.query.sortDirection,
    };
    const blogId = req.params.blogId;
    const foundPosts = await this.QueryPostRepository.getAllPosts({
      ...sortData,
      blogId,
    });

    return res.send(foundPosts);
  }

  async createBlog(req: RequestWithBody<InputBlogDataType>, res: Response) {
    const blog = await this.BlogService.createBlog(req.body);
    return res.status(201).send(blog);
  }

  async createPostForBlog(
    req: RequestWithBodyAndParams<BlogIdParams, InputCreatePostToBlogDataType>,
    res: Response
  ) {
    const id = req.params.blogId;
    const { title, shortDescription, content } = req.body;
    const createdPost = await this.BlogService.createPostToBlog(id, {
      title,
      shortDescription,
      content,
    });

    return res.status(201).send(createdPost);
  }

  async updateBlog(
    req: RequestWithBodyAndParams<Params, InputBlogDataType>,
    res: Response
  ) {
    const id = req.params.id;
    const blog = await this.BlogRepository.getBlogByBlogId(id);
    if (!blog) {
      res.sendStatus(404);
      return;
    }
    const updateData = {
      name: req.body.name,
      description: req.body.description,
      websiteUrl: req.body.websiteUrl,
    };
    const updatedBlog = await this.BlogService.updateBlog(blog, updateData);
    if (!updatedBlog) {
      res.sendStatus(500);
      return;
    }
    res.sendStatus(204);
    return;
  }

  async deleteBlog(req: RequestWithParams<Params>, res: Response) {
    const id = req.params.id;
    const status = await this.BlogRepository.deleteBlog(id);

    if (!status) {
      res.sendStatus(404);
      return;
    }
    return res.sendStatus(204);
  }
}
