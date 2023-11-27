import { Router, Request, Response } from "express";
import { PostRepository } from "../repositories/post-repository";
import { authMiddleware } from "../middlewares/auth/auth-middleware";
import {
  Params,
  RequestWithBodyAndParams,
  RequestWithParams,
  RequestWithBody,
} from "../types/common";
import { PostBody } from "../types/post/input";
import { postValidation } from "../middlewares/post/post-middleware";
import { BlogRepository } from "../repositories/blog-repositry";
import { OutputPostType } from "../types/post/output";

export const postRoute = Router({});

postRoute.get("/", async (req: Request, res: Response) => {
  const posts = await PostRepository.getAllPosts();

  return res.send(posts);
});

postRoute.get("/:id", async (req: RequestWithParams<Params>, res: Response) => {
  const id = req.params.id;
  const post = await PostRepository.getPostById(id);

  if (!post) {
    res.sendStatus(404);
    return;
  }

  res.send(post);
});

postRoute.post(
  "/",
  authMiddleware,
  postValidation(),
  async (req: RequestWithBody<OutputPostType>, res: Response) => {
    const blog = await BlogRepository.getBlogById(req.body.id);

    if (!blog) {
      res.sendStatus(404);
      return;
    }

    const post = await PostRepository.createPost(req.body);

    return res.status(201).send(post);
  }
);

postRoute.put(
  "/:id",
  authMiddleware,
  postValidation(),
  async (req: RequestWithBodyAndParams<Params, PostBody>, res: Response) => {
    const id = req.params.id;
    let post: OutputPostType | null = await PostRepository.getPostById(id);
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
