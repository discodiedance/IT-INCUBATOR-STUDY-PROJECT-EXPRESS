import { Router, Response } from "express";
import {
  Params,
  RequestWithBodyAndParams,
  RequestWithParams,
} from "../types/common";
import { commentValidation } from "../middlewares/comment/comment-validation";
import { OutputCommentType } from "../types/comment/output";
import { UpdateCommentData } from "../types/comment/input";
import { CommentService } from "../domain/comment-service";
import { QueryCommentRepository } from "../repositories/query-repository/query-comment-repository";
import { CommentRepository } from "../repositories/comment-repository";
import { authTokenMiddleware } from "../middlewares/auth/auth-access-token-middleware";
import { OutputUserType } from "../types/user/output";

export const commentRoute = Router({});

commentRoute.get(
  "/:id",
  async (req: RequestWithParams<Params>, res: Response) => {
    const id: string = req.params.id;
    const comment: OutputCommentType | null =
      await QueryCommentRepository.getCommentById(id);

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
  async (
    req: RequestWithBodyAndParams<Params, UpdateCommentData>,
    res: Response
  ) => {
    const user: OutputUserType | null = req.user;
    const id: string = req.params.id;
    if (!user) {
      res.sendStatus(401);
      return;
    }
    const content: UpdateCommentData = req.body;

    const comment: OutputCommentType | null =
      await QueryCommentRepository.getCommentById(id);
    if (!comment) {
      res.sendStatus(404);
      return;
    }

    const status: Promise<boolean | null> = CommentService.checkCredentials(
      comment,
      req!.user
    );
    if (!status) {
      res.sendStatus(403);
      return;
    }
    await CommentService.updateComment(id, content);
    return res.sendStatus(204);
  }
);

commentRoute.delete(
  "/:id",
  authTokenMiddleware,
  async (req: RequestWithParams<Params>, res: Response) => {
    const user: OutputUserType | null = req.user;
    if (!user) {
      return res.sendStatus(401);
    }
    const id: string = req.params.id;
    const comment: OutputCommentType | null =
      await QueryCommentRepository.getCommentById(id);

    if (!comment) {
      res.sendStatus(404);
      return;
    }
    const status: Promise<boolean | null> = CommentService.checkCredentials(
      comment,
      req.user
    );

    if (!status) {
      res.sendStatus(403);
      return;
    }

    await CommentRepository.deleteComment(id);

    return res.sendStatus(204);
  }
);
