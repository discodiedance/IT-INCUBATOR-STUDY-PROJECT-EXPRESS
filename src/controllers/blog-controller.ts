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
import { BlogSortDataType, CreateBlogDataType } from "../types/blog/blog-dto";
import {
  InputCreatePostToBlogDataType,
  InputPostSortDataType,
} from "../types/post/input";
import { CreatePostDataType, PostSortDataType } from "../types/post/post-dto";

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

    res.send(blogs);
    return;
  }

  async getBlogByBlogId(req: RequestWithParams<Params>, res: Response) {
    const blog = await this.QueryBlogRepository.getMappedBlogById(
      req.params.id
    );

    if (!blog) {
      res.sendStatus(404);
      return;
    }
    res.send(blog);
    return;
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
      blogId: req.params.blogId,
    };

    if (req.user) {
      const posts = await this.QueryPostRepository.getAllPostsWithStatus(
        req.user.id,
        sortData
      );
      res.status(200).send(posts);
      return;
    }

    const posts = await this.QueryPostRepository.getAllPostsWithStatus(
      null,
      sortData
    );

    res.status(200).send(posts);
    return;
  }

  async createBlog(req: RequestWithBody<InputBlogDataType>, res: Response) {
    const blogCreateData: CreateBlogDataType = {
      name: req.body.name,
      description: req.body.description,
      websiteUrl: req.body.websiteUrl,
    };
    const blog = await this.BlogService.createBlog(blogCreateData);
    res.status(201).send(blog);
    return;
  }

  async createPostForBlog(
    req: RequestWithBodyAndParams<BlogIdParams, InputCreatePostToBlogDataType>,
    res: Response
  ) {
    const blogId = req.params.blogId;
    const blog = await this.BlogRepository.getBlogByBlogId(blogId);

    const createPostToBlogData: CreatePostDataType = {
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      blogId: blogId,
      blogName: blog!.name,
    };
    const createdPost =
      await this.BlogService.createPostToBlog(createPostToBlogData);

    res.status(201).send(createdPost);
    return;
  }

  async updateBlog(
    req: RequestWithBodyAndParams<Params, InputBlogDataType>,
    res: Response
  ) {
    const blog = await this.BlogRepository.getBlogByBlogId(req.params.id);
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
    const status = await this.BlogRepository.deleteBlog(req.params.id);

    if (!status) {
      res.sendStatus(404);
      return;
    }
    return res.sendStatus(204);
  }
}
