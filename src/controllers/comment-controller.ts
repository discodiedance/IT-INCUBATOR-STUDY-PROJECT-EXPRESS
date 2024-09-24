import { Response } from "express";
import { inject, injectable } from "inversify";

import { CommentService } from "../features/application/services/comment-service";
import { LikeService } from "../features/application/services/like-service";

import {
  InputLikeDataType,
  InputUpdateCommentDataType,
} from "../types/comment/input";
import {
  RequestWithParams,
  Params,
  RequestWithBodyAndParams,
  CommentIdParams,
} from "../types/common";
import { OutputUserType } from "../types/user/output";
import { JwtService } from "../features/application/services/jwt-service";
import { CommentRepository } from "../features/infrastructure/repositories/comment-repository";
import { QueryCommentRepository } from "../features/infrastructure/repositories/query-repository/query-comment-repository";
import { UpdateCommentLikeData } from "../types/comment-likes/comment-likes-dto";

@injectable()
export class CommentController {
  constructor(
    @inject(CommentService) protected CommentService: CommentService,
    @inject(LikeService) protected LikeService: LikeService,
    @inject(JwtService) protected JwtService: JwtService,
    @inject(QueryCommentRepository)
    protected QueryCommentRepository: QueryCommentRepository,
    @inject(CommentRepository) protected CommentRepository: CommentRepository
  ) {}

  async getComment(req: RequestWithParams<Params>, res: Response) {
    const commentId = req.params.id;
    if (!req.headers.authorization) {
      const comment =
        await this.QueryCommentRepository.getMappedCommentByCommentId(
          commentId
        );

      if (!comment) {
        res.sendStatus(404);
        return;
      }

      res.status(200).send(comment);
      return;
    }

    const userId = await this.JwtService.getUserIdByJWTToken(
      req.headers.authorization.split(" ")[1]
    );

    const comment =
      await this.QueryCommentRepository.getCommentByCommentIdWithStatus(
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
  async putLike(
    req: RequestWithBodyAndParams<CommentIdParams, InputLikeDataType>,
    res: Response
  ) {
    const comment =
      await this.QueryCommentRepository.getCommentByCommentIdWithStatus(
        req.params.commentId,
        req.user!.id
      );

    if (!comment) {
      res.sendStatus(404);
      return;
    }

    const updateCommentLikeData: UpdateCommentLikeData = {
      comment,
      likeStatus: req.body.likeStatus,
      parentId: req.user!.id,
    };

    const likeResult = await this.LikeService.updateCommentLike(
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
    req: RequestWithBodyAndParams<CommentIdParams, InputUpdateCommentDataType>,
    res: Response
  ) {
    const user = req.user as OutputUserType;
    const content = req.body;
    const commentId = req.params.commentId;
    const comment =
      await this.CommentRepository.getCommentByCommentId(commentId);

    if (!comment) {
      res.sendStatus(404);
      return;
    }

    const checkedUser = await this.CommentService.checkCredentials(
      comment,
      user
    );

    if (!checkedUser) {
      res.sendStatus(403);
      return;
    }

    const status = await this.CommentService.updateComment(comment, content);
    if (!status) {
      return null;
    }

    res.sendStatus(204);
    return;
  }

  async deleteComment(req: RequestWithParams<CommentIdParams>, res: Response) {
    const user = req.user as OutputUserType;
    const commentId = req.params.commentId;

    const comment =
      await this.CommentRepository.getCommentByCommentId(commentId);

    if (!comment) {
      res.sendStatus(404);
      return;
    }

    const checkedUser = await this.CommentService.checkCredentials(
      comment,
      user
    );

    if (!checkedUser) {
      res.sendStatus(403);
      return;
    }

    await this.CommentRepository.deleteComment(commentId);
    return res.sendStatus(204);
  }
}
