import { Router, Response } from "express";
import { PostRepository } from "../repositories/post-repository";
import { authMiddleware } from "../middlewares/auth/auth-middleware";
import {
  Params,
  RequestWithBodyAndParams,
  RequestWithParams,
  RequestWithBody,
  RequestTypeWithQuery,
  RequestWithBodyAndBlog,
} from "../types/common";
import { PostBody } from "../types/post/input";
import {
  createPostValidation,
  postValidation,
} from "../middlewares/post/post-middleware";
import { OutputPostType } from "../types/post/output";
import { QueryPostRepository } from "../repositories/query-repository/query-post-repository";
import { SortDataType } from "../types/blog/input";
import { PostService } from "../domain/post-service";
import { QueryBlogRepository } from "../repositories/query-repository/query-blog-repository";

export const postRoute = Router({});

postRoute.get(
  "/",
  async (req: RequestTypeWithQuery<SortDataType>, res: Response) => {
    const sortData = {
      searchNameTerm: req.query.searchNameTerm,
      sortBy: req.query.sortBy,
      sortDirection: req.query.sortDirection,
      pageNumber: req.query.pageNumber,
      pageSize: req.query.pageSize,
    };
    const posts = await QueryPostRepository.getAllPosts(sortData);

    return res.send(posts);
  }
);

postRoute.get("/:id", async (req: RequestWithParams<Params>, res: Response) => {
  const id = req.params.id;
  const post = await QueryPostRepository.getPostById(id);

  if (!post) {
    res.sendStatus(404);
    return;
  }

  res.send(post);
});

postRoute.post(
  "/",
  authMiddleware,
  createPostValidation(),
  async (req: RequestWithBodyAndBlog<OutputPostType>, res: Response) => {
    const blog = await QueryBlogRepository.getBlogById(req.body.blogId);
    // const blog = req.blog;
    if (!blog) {
      res.sendStatus(404);
      return;
    }

    const post = await PostService.createPost({
      ...req.body,
      blogName: blog.name,
    });

    return res.status(201).send(post);
  }
);

postRoute.put(
  "/:id",
  authMiddleware,
  postValidation(),
  async (req: RequestWithBodyAndParams<Params, PostBody>, res: Response) => {
    const id = req.params.id;
    let post: OutputPostType | null = await QueryPostRepository.getPostById(id);
    let { title, shortDescription, content, blogId } = req.body;

    if (!post) {
      res.sendStatus(404);
      return;
    }

    (post.title = title),
      (post.shortDescription = shortDescription),
      (post.content = content),
      (post.blogId = blogId);
    await PostRepository.updatePost(id, post);
    return res.sendStatus(204);
  }
);

postRoute.delete(
  "/:id",
  authMiddleware,
  async (req: RequestWithParams<Params>, res: Response) => {
    const id = req.params.id;

    const status = await PostRepository.deletePost(id);

    if (status == false) {
      res.sendStatus(404);
      return;
    }
    return res.sendStatus(204);
  }
);
