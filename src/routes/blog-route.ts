import { Router } from "express";
import {
  allPostsForBlogByIdValidation,
  blogValidation,
} from "../middlewares/blog/blog-validation";
import { postBlogIdValidation } from "../middlewares/post/post-validation";
import { blogController } from "./composition-root";
import { authMiddleware } from "../middlewares/auth/auth-basic-middleware";

export const blogRoute = Router({});

blogRoute.get("/", blogController.getAllBlogs.bind(blogController));

blogRoute.get("/:id", blogController.getBlogById.bind(blogController));

blogRoute.get(
  "/:blogId/posts",
  allPostsForBlogByIdValidation(),
  blogController.getAllPostsFromBlog.bind(blogController)
);

blogRoute.post(
  "/",
  authMiddleware,
  blogValidation(),
  blogController.createBlog.bind(blogController)
);

blogRoute.post(
  "/:blogId/posts",
  authMiddleware,
  postBlogIdValidation(),
  blogController.createPostForBlog.bind(blogController)
);

blogRoute.put(
  "/:id",
  authMiddleware,
  blogValidation(),
  blogController.updateBlog.bind(blogController)
);

blogRoute.delete(
  "/:id",
  authMiddleware,
  blogController.deleteBlog.bind(blogController)
);
