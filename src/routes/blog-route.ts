import { Router, Request, Response } from "express";
import { BlogRepository } from "../repositories/blog-repositry";
import {
  Params,
  RequestWithBodyAndParams,
  RequestWithParams,
} from "../types/common";
import { BlogBody } from "../types/blog/input";
import { authMiddleware } from "../middlewares/auth/auth-middleware";
import { blogPostValidation } from "../validators/blogs-validator";
import { db } from "./../db/db";

export const blogRoute = Router({});

blogRoute.get("/", (req: Request, res: Response) => {
  const blogs = BlogRepository.getAllBlogs();

  res.send(blogs);
});

blogRoute.get(
  "/:id",
  authMiddleware,
  (req: RequestWithParams<Params>, res: Response) => {
    const id = req.params.id;
    const blog = BlogRepository.getBlogById(id);

    if (!blog) {
      res.sendStatus(404);
    }

    res.send(blog);
  }
);

blogRoute.post(
  "/:id",
  authMiddleware,
  blogPostValidation,
  (req: RequestWithParams<Params>, res: Response) => {
    const id = req.params.id;
    const blog = BlogRepository.getBlogById(id);

    if (!blog) {
      res.sendStatus(404);
    }

    res.send(blog);
  }
);

blogRoute.put(
  "/:id",
  authMiddleware,
  blogPostValidation,
  (req: RequestWithBodyAndParams<Params, BlogBody>, res: Response) => {
    const id = req.params.id;
    let blog = BlogRepository.getBlogById(id);
    let { name, description, websiteUrl } = req.body;

    if (!blog) {
      res.sendStatus(404);
      return;
    }
    (blog.name = name),
      (blog.description = description),
      (blog.websiteUrl = websiteUrl);
  }
);

blogRoute.delete(
  "/:id",
  authMiddleware,
  blogPostValidation,
  (req: RequestWithParams<Params>, res: Response) => {
    const id = req.params.id;
    const blog = BlogRepository.getBlogById(id);
    if (!blog) {
      res.sendStatus(404);
      return;
    }
    const blogIndex = db.blogs.findIndex((b) => b.id == id);
    if (blogIndex == -1) {
      res.sendStatus(404);
      return;
    }
    db.blogs.splice(blogIndex, 1);
    res.sendStatus(204);
  }
);
