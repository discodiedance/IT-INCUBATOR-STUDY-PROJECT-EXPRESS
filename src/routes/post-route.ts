import { Router } from "express";
import { postController } from "./composition-root";
import {
  authTokenForGetRequests,
  authTokenMiddleware,
} from "../features/application/middlewares/auth/auth-access-token-middleware";
import { authMiddleware } from "../features/application/middlewares/auth/auth-basic-middleware";
import { commentCreationValidation } from "../features/application/validators/comment/comment-validation";
import {
  allCommentsForPostByIdValidation,
  postIdValidation,
  postLikeValidation,
  postValidation,
} from "../features/application/validators/post/post-validation";

export const postRoute = Router({});

postRoute.get(
  "/",
  authTokenForGetRequests,
  postController.getAllPosts.bind(postController)
);

postRoute.get(
  "/:id",
  postIdValidation(),
  authTokenForGetRequests,
  postController.getPost.bind(postController)
);

postRoute.get(
  "/:postId/comments",
  allCommentsForPostByIdValidation(),
  authTokenForGetRequests,
  postController.getAllCommentsFromPost.bind(postController)
);

postRoute.put(
  "/:postId/like-status",
  authTokenMiddleware,
  postLikeValidation(),
  postController.putLike.bind(postController)
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
