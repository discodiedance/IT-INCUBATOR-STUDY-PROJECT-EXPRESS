import { Router } from "express";
import { blogController } from "./composition-root";
import { authMiddleware } from "../features/application/middlewares/auth/auth-basic-middleware";
import {
  allPostsForBlogByIdValidation,
  blogValidation,
} from "../features/application/validators/blog/blog-validation";
import { postBlogIdValidation } from "../features/application/validators/post/post-validation";
import { authTokenForGetRequests } from "../features/application/middlewares/auth/auth-access-token-middleware";

export const blogRoute = Router({});

blogRoute.get("/", blogController.getAllBlogs.bind(blogController));

blogRoute.get("/:id", blogController.getBlogByBlogId.bind(blogController));

blogRoute.get(
  "/:blogId/posts",
  authTokenForGetRequests,
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
