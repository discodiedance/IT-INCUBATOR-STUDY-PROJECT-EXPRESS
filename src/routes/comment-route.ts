import { Router, Response } from "express";
import {
  Params,
  RequestWithBodyAndParams,
  RequestWithParams,
} from "../types/common";
import { commentValidation } from "../middlewares/comment/comment-validation";
import { OutputCommentType } from "../types/comment/output";
import { CommentBody } from "../types/comment/input";
import { CommentService } from "../domain/comment-service";
import { QueryCommentRepository } from "../repositories/query-repository/query-comment-repository";
import { CommentRepository } from "../repositories/comment-repository";
import { authTokenMiddleware } from "../middlewares/auth/auth-token-middleware";

export const commentRoute = Router({});

commentRoute.get(
  "/:id",
  async (req: RequestWithParams<Params>, res: Response) => {
    const id = req.params.id;
    const comment = await QueryCommentRepository.getCommentById(id);

    if (!comment) {
      res.sendStatus(404);
      return;
    }

    res.send(comment);
  }
);

commentRoute.put(
  "/:id",
  authTokenMiddleware,
  commentValidation(),
  async (req: RequestWithBodyAndParams<Params, CommentBody>, res: Response) => {
    const user = req.user;
    if (!user) {
      res.sendStatus(401);
      return;
    }
    const id = req.params.id;
    let comment: OutputCommentType | null =
      await QueryCommentRepository.getCommentById(id);
    let { content } = req.body;

    if (!comment) {
      res.sendStatus(404);
      return;
    }

    if (
      comment.commentatorInfo.userId !== req.user?.id &&
      comment.commentatorInfo.userLogin !== req.user?.login
    ) {
      res.sendStatus(403);
      return;
    }

    comment.content = content;

    await CommentService.updateComment(id, comment);
    return res.sendStatus(204);
  }
);

commentRoute.delete(
  "/:id",
  authTokenMiddleware,
  async (req: RequestWithBodyAndParams<Params, CommentBody>, res: Response) => {
    const user = req.user;
    if (!user) {
      return res.sendStatus(401);
    }
    const id = req.params.id;
    let comment: OutputCommentType | null =
      await QueryCommentRepository.getCommentById(id);
    if (!comment) {
      res.sendStatus(404);
      return;
    }
    if (
      comment.commentatorInfo.userId !== req.user?.id &&
      comment.commentatorInfo.userLogin !== req.user?.login
    ) {
      res.sendStatus(403);
      return;
    }

    await CommentRepository.deleteComment(id);

    return res.sendStatus(204);
  }
);
