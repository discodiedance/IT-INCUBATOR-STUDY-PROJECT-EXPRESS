import { Router } from "express";
import { commentController } from "./composition-root";
import {
  commentLikeValidation,
  commentValidation,
} from "../middlewares/comment/comment-validation";
import {
  authTokenForGetRequets,
  authTokenMiddleware,
} from "../middlewares/auth/auth-access-token-middleware";

export const commentRoute = Router({});

commentRoute.get(
  "/:id",
  authTokenForGetRequets,
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
