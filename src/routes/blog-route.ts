import { Router, Request, Response } from "express";
import { BlogRepository } from "../repositories/blog-repositry";
import {
  Params,
  RequestWithBodyAndParams,
  RequestWithParams,
  RequestWithBody,
} from "../types/common";
import { BlogBody } from "../types/blog/input";
import { authMiddleware } from "../middlewares/auth/auth-middleware";
import { blogValidation } from "../middlewares/blog/blog-middleware";
import { db } from "./../db/db";
import { randomUUID } from "crypto";

export const blogRoute = Router({});

blogRoute.get("/", (req: Request, res: Response) => {
  const blogs = BlogRepository.getAllBlogs();

  return res.send(blogs);
});

blogRoute.get("/:id", (req: RequestWithParams<Params>, res: Response) => {
  const id = req.params.id;
  const blog = BlogRepository.getBlogById(id);

  if (!blog) {
    res.sendStatus(404);
    return;
  }

  return res.send(blog);
});

blogRoute.post(
  "/",
  authMiddleware,
  blogValidation(),
  (req: RequestWithBody<BlogBody>, res: Response) => {
    let { name, description, websiteUrl } = req.body;

    const newBlog = {
      id: randomUUID(),
      name,
      description,
      websiteUrl,
    };

    BlogRepository.createBlog(newBlog);

    return res.status(201).send(newBlog);
  }
);

blogRoute.put(
  "/:id",
  authMiddleware,
  blogValidation(),
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

    return res.sendStatus(204);
  }
);

blogRoute.delete(
  "/:id",
  authMiddleware,
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
    return res.sendStatus(204);
  }
);
