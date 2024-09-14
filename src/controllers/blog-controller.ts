import { Response } from "express";

import { BlogRepository } from "../repositories/blog-repositry";
import { QueryBlogRepository } from "../repositories/query-repository/query-blog-repository";
import { QueryPostRepository } from "../repositories/query-repository/query-post-repository";

import { BlogService } from "../domain/blog-service";

import { BlogSortDataType, InputBlogBodyType } from "../types/blog/input";
import { OutputBlogType } from "../types/blog/output";
import {
  RequestTypeWithQuery,
  RequestWithParams,
  Params,
  RequestTypeWithQueryBlogId,
  BlogIdParams,
  RequestWithBody,
  RequestWithBodyAndParams,
} from "../types/common";
import { CreatePostToBlogType, OutputPostType } from "../types/post/output";

export class BlogController {
  constructor(
    protected BlogService: BlogService,
    protected QueryBlogRepository: QueryBlogRepository,
    protected BlogRepository: BlogRepository,
    protected QueryPostRepository: QueryPostRepository
  ) {}
  async getAllBlogs(
    req: RequestTypeWithQuery<BlogSortDataType>,
    res: Response
  ) {
    const sortData = {
      searchNameTerm: req.query.searchNameTerm,
      sortBy: req.query.sortBy,
      sortDirection: req.query.sortDirection,
      pageNumber: req.query.pageNumber,
      pageSize: req.query.pageSize,
    };
    const blogs = await this.QueryBlogRepository.getAllBlogs(sortData);

    return res.send(blogs);
  }

  async getBlogById(req: RequestWithParams<Params>, res: Response) {
    const id: string = req.params.id;
    const blog: OutputBlogType | null =
      await this.QueryBlogRepository.getBlogById(id);

    if (!blog) {
      res.sendStatus(404);
      return;
    }
    return res.send(blog);
  }

  async getAllPostsFromBlog(
    req: RequestTypeWithQueryBlogId<BlogSortDataType, BlogIdParams>,
    res: Response
  ) {
    const sortData = {
      sortBy: req.query.sortBy,
      sortDirection: req.query.sortDirection,
      pageNumber: req.query.pageNumber,
      pageSize: req.query.pageSize,
    };
    const blogId: string = req.params.blogId;
    const foundPosts = await this.QueryPostRepository.getAllPosts({
      ...sortData,
      blogId,
    });

    return res.send(foundPosts);
  }

  async createBlog(req: RequestWithBody<InputBlogBodyType>, res: Response) {
    const blog: OutputBlogType = await this.BlogService.createBlog(req.body);
    return res.status(201).send(blog);
  }

  async createPostForBlog(
    req: RequestWithBodyAndParams<BlogIdParams, CreatePostToBlogType>,
    res: Response
  ) {
    const id: string = req.params.blogId;
    const { title, shortDescription, content } = req.body;
    const createdPost: OutputPostType | null =
      await this.BlogService.createPostToBlog(id, {
        title,
        shortDescription,
        content,
      });

    return res.status(201).send(createdPost);
  }

  async updateBlog(
    req: RequestWithBodyAndParams<Params, InputBlogBodyType>,
    res: Response
  ) {
    const id: string = req.params.id;
    const blog: OutputBlogType | null =
      await this.QueryBlogRepository.getBlogById(id);
    if (!blog) {
      res.sendStatus(404);
      return;
    }
    const updateData = {
      name: req.body.name,
      description: req.body.description,
      websiteUrl: req.body.websiteUrl,
    };
    await this.BlogService.updateBlog(id, updateData);
    res.sendStatus(204);
    return;
  }

  async deleteBlog(req: RequestWithParams<Params>, res: Response) {
    const id: string = req.params.id;
    const status: boolean = await this.BlogRepository.deleteBlog(id);

    if (!status) {
      res.sendStatus(404);
      return;
    }
    return res.sendStatus(204);
  }
}
