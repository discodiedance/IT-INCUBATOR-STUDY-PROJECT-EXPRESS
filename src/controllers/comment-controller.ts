import { Response } from "express";
import { inject, injectable } from "inversify";
import { CommentService } from "../features/application/services/comment-service";
import { CommentLikesService } from "../features/application/services/comment-likes-service";
import { InputUpdateCommentDataType } from "../types/comment/input";
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
import { UpdateCommentLikeData } from "../types/likes/comment-likes/comment-likes-dto";
import { InputLikeDataType } from "../types/likes/input";
import { CommentLikesRepository } from "./../features/infrastructure/repositories/comment-likes-repository";

@injectable()
export class CommentController {
  constructor(
    @inject(CommentLikesRepository)
    protected CommentLikesRepository: CommentLikesRepository,
    @inject(CommentService) protected CommentService: CommentService,
    @inject(CommentLikesService)
    protected CommentLikesService: CommentLikesService,
    @inject(JwtService) protected JwtService: JwtService,
    @inject(QueryCommentRepository)
    protected QueryCommentRepository: QueryCommentRepository,
    @inject(CommentRepository) protected CommentRepository: CommentRepository
  ) {}

  async getComment(req: RequestWithParams<Params>, res: Response) {
    const commentId = req.params.id;
    if (!commentId) {
      res.sendStatus(404);
      return;
    }
    if (req.user) {
      const comment =
        await this.QueryCommentRepository.getMappedCommentByCommentIdWithStatus(
          commentId,
          req.user.id
        );
      res.status(200).send(comment);
      return;
    }
    const comment =
      await this.QueryCommentRepository.getMappedCommentByCommentIdWithStatus(
        commentId,
        null
      );
    res.status(200).send(comment);
    return;
  }

  async putLike(
    req: RequestWithBodyAndParams<CommentIdParams, InputLikeDataType>,
    res: Response
  ) {
    const userId = req.user!.id;

    const comment =
      await this.QueryCommentRepository.getMappedCommentByCommentIdWithStatus(
        req.params.commentId,
        userId
      );

    if (!comment) {
      res.sendStatus(404);
      return;
    }

    const updateCommentLikeData: UpdateCommentLikeData = {
      comment,
      likeStatus: req.body.likeStatus,
      parentId: userId,
    };

    const likeResult = await this.CommentLikesService.updateCommentLike(
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
    res.sendStatus(204);
    return;
  }
}
