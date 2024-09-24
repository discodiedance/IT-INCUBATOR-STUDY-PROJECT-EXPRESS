import { Router } from "express";
import { commentController } from "./composition-root";
import {
  authTokenForGetRequests,
  authTokenMiddleware,
} from "../features/application/middlewares/auth/auth-access-token-middleware";
import {
  commentLikeValidation,
  commentValidation,
} from "../features/application/validators/comment/comment-validation";

export const commentRoute = Router({});

commentRoute.get(
  "/:id",
  authTokenForGetRequests,
  commentController.getComment.bind(commentController)
);

commentRoute.put(
  "/:commentId/like-status",
  authTokenMiddleware,
  commentLikeValidation(),
  commentController.putLike.bind(commentController)
);

commentRoute.put(
  "/:commentId",
  authTokenMiddleware,
  commentValidation(),
  commentController.updateComment.bind(commentController)
);

commentRoute.delete(
  "/:commentId",
  authTokenMiddleware,
  commentController.deleteComment.bind(commentController)
);
