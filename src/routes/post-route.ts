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
import { db } from "../db/db";
import { BlogRepository } from "../repositories/blog-repositry";
import { randomUUID } from "crypto";

export const postRoute = Router({});

postRoute.get("/", (req: Request, res: Response) => {
  const posts = PostRepository.getAllPosts();
  res.send(posts);
});

postRoute.get(
  "/:id",
  authMiddleware,
  (req: RequestWithParams<Params>, res: Response) => {
    const id = req.params.id;
    const post = PostRepository.getPostById(id);
    if (!post) {
      res.sendStatus(404);
    }
    res.send(post);
  }
);

postRoute.post(
  "/",
  authMiddleware,
  postValidation,
  (req: RequestWithBody<PostBody>, res: Response) => {
    let { title, shortDescription, content, blogId } = req.body;

    const blog = BlogRepository.getBlogById(blogId);

    if (!blog) return res.sendStatus(404);

    const newPost = {
      id: randomUUID(),
      title,
      shortDescription,
      content,
      blogId,
      blogName: blog.name,
    };

    PostRepository.createNewPost(newPost);

    return res.status(201).send(newPost);
  }
);

postRoute.put(
  "/:id",
  authMiddleware,
  postValidation,
  (req: RequestWithBodyAndParams<Params, PostBody>, res: Response) => {
    const id = req.params.id;
    let post = PostRepository.getPostById(id);
    let { title, shortDescription, content, blogId } = req.body;

    if (!post) {
      res.sendStatus(404);
      return;
    }
    (post.title = title),
      (post.shortDescription = shortDescription),
      (post.content = content),
      (post.blogId = blogId);
  }
);

postRoute.delete(
  "/:id",
  authMiddleware,
  postValidation,
  (req: RequestWithParams<Params>, res: Response) => {
    const id = req.params.id;
    const post = PostRepository.getPostById(id);
    if (!post) {
      res.sendStatus(404);
      return;
    }
    const postIndex = db.posts.findIndex((p) => p.id == id);
    if (postIndex == -1) {
      res.sendStatus(404);
      return;
    }
    db.posts.splice(postIndex, 1);
    res.sendStatus(204);
  }
);
