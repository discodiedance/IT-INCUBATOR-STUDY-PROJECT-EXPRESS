import { Response } from "express";

import { CommentRepository } from "../repositories/comment-repository";
import { QueryCommentRepository } from "../repositories/query-repository/query-comment-repository";

import { JwtService } from "../aplication/jwt-service";
import { CommentService } from "../domain/comment-service";
import { LikeService } from "../domain/like-service";

import { InputLikeBody, UpdateCommentData } from "../types/comment/input";
import {
  OutputCommentType,
  OutputCommentTypeWithStatus,
} from "../types/comment/output";
import {
  RequestWithParams,
  Params,
  RequestWithBodyAndParams,
  CommentIdParams,
} from "../types/common";
import { InputUpdateCommentLikeData } from "../types/like/input";
import { OutputUserType } from "../types/user/output";

export class CommentController {
  constructor(
    protected CommentService: CommentService,
    protected LikeService: LikeService,
    protected JwtService: JwtService,
    protected QueryCommentRepository: QueryCommentRepository,
    protected CommentRepository: CommentRepository
  ) {}
  async getComment(req: RequestWithParams<Params>, res: Response) {
    const commentId: string = req.params.id;
    if (!req.headers.authorization) {
      const comment: OutputCommentType | null =
        await this.QueryCommentRepository.getCommentById(commentId);
      if (!comment) {
        res.sendStatus(404);
        return;
      }
      res.status(200).send(comment);
      return;
    } else {
      const userId = await this.JwtService.getUserIdByJWTToken(
        req.headers.authorization.split(" ")[1]
      );
      const comment: OutputCommentTypeWithStatus | null =
        await this.QueryCommentRepository.getCommentByIdWithStatus(
          commentId,
          userId
        );
      if (!comment) {
        res.sendStatus(404);
        return;
      }
      res.status(200).send(comment);
      return;
    }
  }
  async putLike(
    req: RequestWithBodyAndParams<CommentIdParams, InputLikeBody>,
    res: Response
  ) {
    const comment: OutputCommentTypeWithStatus | null =
      await this.QueryCommentRepository.getCommentByIdWithStatus(
        req.params.commentId,
        req.user!.id
      );
    if (!comment) {
      res.sendStatus(404);
      return;
    }
    const updateCommentLikeData: InputUpdateCommentLikeData = {
      comment,
      likeStatus: req.body.likeStatus,
      parentId: req.user!.id,
    };

    const likeResult: boolean = await this.LikeService.updateCommentLike(
      updateCommentLikeData
    );
    if (!likeResult) {
      res.sendStatus(400);
      return;
    }
    res.sendStatus(204);
    return;
  }
  async updateComment(
    req: RequestWithBodyAndParams<CommentIdParams, UpdateCommentData>,
    res: Response
  ) {
    const user = req.user as OutputUserType;
    const content: UpdateCommentData = req.body;
    const commentId: string = req.params.commentId;
    const comment: OutputCommentType | null =
      await this.QueryCommentRepository.getCommentById(commentId);

    if (!comment) {
      res.sendStatus(404);
      return;
    }

    const checkedUser: boolean | null =
      await this.CommentService.checkCredentials(comment, user);

    if (!checkedUser) {
      res.sendStatus(403);
      return;
    }

    const status: boolean = await this.CommentService.updateComment(
      content,
      commentId
    );
    if (!status) {
      return null;
    }

    res.sendStatus(204);
    return;
  }
  async deleteComment(req: RequestWithParams<CommentIdParams>, res: Response) {
    const user = req.user as OutputUserType;
    const commentId: string = req.params.commentId;

    const comment: OutputCommentType | null =
      await this.QueryCommentRepository.getCommentById(commentId);

    if (!comment) {
      res.sendStatus(404);
      return;
    }
    const checkedUser: boolean | null =
      await this.CommentService.checkCredentials(comment, user);

    if (!checkedUser) {
      res.sendStatus(403);
      return;
    }

    await this.CommentRepository.deleteComment(commentId);

    return res.sendStatus(204);
  }
}
