import { Router, Response } from "express";
import { BlogRepository } from "../repositories/blog-repositry";
import {
  Params,
  RequestWithBodyAndParams,
  RequestWithParams,
  RequestWithBody,
  BlogIdParams,
  RequestTypeWithQuery,
  RequestTypeWithQueryBlogId,
} from "../types/common";
import { InputBlogBodyType, BlogSortDataType } from "../types/blog/input";
import { authMiddleware } from "../middlewares/auth/auth-basic-middleware";
import {
  allPostsForBlogByIdValidation,
  blogValidation,
} from "../middlewares/blog/blog-validation";
import { OutputBlogType } from "../types/blog/output";
import { BlogService } from "../domain/blog-service";
import { postBlogIdValidation } from "../middlewares/post/post-validation";
import { CreatePostToBlogType, OutputPostType } from "../types/post/output";
import { QueryBlogRepository } from "../repositories/query-repository/query-blog-repository";
import { QueryPostRepository } from "../repositories/query-repository/query-post-repository";

export const blogRoute = Router({});

blogRoute.get(
  "/",
  async (req: RequestTypeWithQuery<BlogSortDataType>, res: Response) => {
    const sortData = {
      searchNameTerm: req.query.searchNameTerm,
      sortBy: req.query.sortBy,
      sortDirection: req.query.sortDirection,
      pageNumber: req.query.pageNumber,
      pageSize: req.query.pageSize,
    };
    const blogs = await QueryBlogRepository.getAllBlogs(sortData);

    return res.send(blogs);
  }
);

blogRoute.get("/:id", async (req: RequestWithParams<Params>, res: Response) => {
  const id: string = req.params.id;
  const blog: OutputBlogType | null = await QueryBlogRepository.getBlogById(id);

  if (!blog) {
    res.sendStatus(404);
    return;
  }
  return res.send(blog);
});

blogRoute.get(
  "/:blogId/posts",
  allPostsForBlogByIdValidation(),
  async (
    req: RequestTypeWithQueryBlogId<BlogSortDataType, BlogIdParams>,
    res: Response
  ) => {
    const sortData = {
      sortBy: req.query.sortBy,
      sortDirection: req.query.sortDirection,
      pageNumber: req.query.pageNumber,
      pageSize: req.query.pageSize,
    };
    const blogId: string = req.params.blogId;
    const foundPosts = await QueryPostRepository.getAllPosts({
      ...sortData,
      blogId,
    });

    return res.send(foundPosts);
  }
);

blogRoute.post(
  "/",
  authMiddleware,
  blogValidation(),
  async (req: RequestWithBody<InputBlogBodyType>, res: Response) => {
    const blog: OutputBlogType = await BlogService.createBlog(req.body);
    return res.status(201).send(blog);
  }
);

blogRoute.post(
  "/:blogId/posts",
  authMiddleware,
  postBlogIdValidation(),
  async (
    req: RequestWithBodyAndParams<BlogIdParams, CreatePostToBlogType>,
    res: Response
  ) => {
    const id: string = req.params.blogId;
    const { title, shortDescription, content } = req.body;
    const createdPost: OutputPostType | null =
      await BlogService.createPostToBlog(id, {
        title,
        shortDescription,
        content,
      });

    return res.status(201).send(createdPost);
  }
);

blogRoute.put(
  "/:id",
  authMiddleware,
  blogValidation(),
  async (
    req: RequestWithBodyAndParams<Params, InputBlogBodyType>,
    res: Response
  ) => {
    const id: string = req.params.id;
    const blog: OutputBlogType | null =
      await QueryBlogRepository.getBlogById(id);
    if (!blog) {
      res.sendStatus(404);
      return;
    }
    const updateData = {
      name: req.body.name,
      description: req.body.description,
      websiteUrl: req.body.websiteUrl,
    };
    await BlogService.updateBlog(id, updateData);
    return res.sendStatus(204);
  }
);

blogRoute.delete(
  "/:id",
  authMiddleware,
  async (req: RequestWithParams<Params>, res: Response) => {
    const id: string = req.params.id;
    const status: boolean = await BlogRepository.deleteBlog(id);

    if (!status) {
      res.sendStatus(404);
      return;
    }
    return res.sendStatus(204);
  }
);
