import { Router } from "express";
import { postController } from "./composition-root";
import {
  allCommentsForPostByIdValidation,
  postValidation,
} from "../middlewares/post/post-validation";
import { commentCreationValidation } from "./../middlewares/comment/comment-validation";
import { authMiddleware } from "../middlewares/auth/auth-basic-middleware";
import {
  authTokenForGetRequets,
  authTokenMiddleware,
} from "../middlewares/auth/auth-access-token-middleware";

export const postRoute = Router({});

postRoute.get("/", postController.getAllPosts.bind(postController));

postRoute.get("/:id", postController.getPost.bind(postController));

postRoute.get(
  "/:postId/comments",
  authTokenForGetRequets,
  allCommentsForPostByIdValidation(),
  postController.getAllCommentsFromPost.bind(postController)
);

postRoute.post(
  "/",
  authMiddleware,
  postValidation(),
  postController.createPost.bind(postController)
);

postRoute.post(
  "/:postId/comments",
  authTokenMiddleware,
  commentCreationValidation(),
  postController.createCommentForPost.bind(postController)
);

postRoute.put(
  "/:id",
  authMiddleware,
  postValidation(),
  postController.updatePost.bind(postController)
);

postRoute.delete(
  "/:id",
  authMiddleware,
  postController.deletePost.bind(postController)
);
