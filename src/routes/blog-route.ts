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
import { OutputBlogType } from "../types/blog/output";

export const blogRoute = Router({});

blogRoute.get("/", async (req: Request, res: Response) => {
  const blogs = await BlogRepository.getAllBlogs();

  return res.send(blogs);
});

blogRoute.get("/:id", async (req: RequestWithParams<Params>, res: Response) => {
  const id = req.params.id;
  const blog = await BlogRepository.getBlogById(id);

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
  async (req: RequestWithBody<BlogBody>, res: Response) => {
    let { name, description, websiteUrl } = req.body;

    const newBlog = {
      name,
      description,
      websiteUrl,
    };

    await BlogRepository.createBlog(newBlog);

    return res.status(201).send(newBlog);
  }
);

blogRoute.put(
  "/:id",
  authMiddleware,
  blogValidation(),
  async (req: RequestWithBodyAndParams<Params, BlogBody>, res: Response) => {
    const id = req.params.id;
    let blog: OutputBlogType | null = await BlogRepository.getBlogById(id);
    let { name, description, websiteUrl } = req.body;

    if (!blog) {
      res.sendStatus(404);
      return;
    }
    (blog.name = name),
      (blog.description = description),
      (blog.websiteUrl = websiteUrl),
      await BlogRepository.updateBlog(id, blog);

    return res.sendStatus(204);
  }
);

blogRoute.delete(
  "/:id",
  authMiddleware,
  async (req: RequestWithParams<Params>, res: Response) => {
    const id = req.params.id;

    const status = await BlogRepository.deleteBlog(id);

    if (!status) {
      res.sendStatus(404);
      return;
    }
    return res.sendStatus(204);
  }
);
