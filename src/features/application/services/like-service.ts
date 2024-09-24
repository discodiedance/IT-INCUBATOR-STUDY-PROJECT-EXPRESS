import { inject, injectable } from "inversify";

import { CommentRepository } from "../../infrastructure/repositories/comment-repository";
import { CommentLikesRepository } from "../../infrastructure/repositories/comment-likes-repository";
import { CommentLikesModel } from "../../domain/entities/commen-likes-entity";
import { QueryCommentRepository } from "../../infrastructure/repositories/query-repository/query-comment-repository";
import { UpdateCommentLikeData } from "../../../types/comment-likes/comment-likes-dto";

@injectable()
export class LikeService {
  constructor(
    @inject(QueryCommentRepository)
    protected QueryCommentRepository: QueryCommentRepository,
    @inject(CommentLikesRepository)
    protected CommentLikesRepository: CommentLikesRepository,
    @inject(CommentRepository) protected CommentRepository: CommentRepository
  ) {}

  async createLike(
    updateCommentLikeData: UpdateCommentLikeData
  ): Promise<boolean> {
    if (updateCommentLikeData.likeStatus === "None") {
      return true;
    }

    const comment = await this.CommentRepository.getCommentByCommentId(
      updateCommentLikeData.comment.id
    );

    if (!comment) {
      return false;
    }

    const createdLikeOrDislike = CommentLikesModel.createLike(
      updateCommentLikeData
    );

    const createdLikeData =
      await this.CommentLikesRepository.save(createdLikeOrDislike);
    if (!createdLikeData) {
      return false;
    }

    if (createdLikeOrDislike.isLikeDataEqualsLike()) {
      comment.addLikeCounter();
      const updatedLikesCounter = await this.CommentRepository.save(comment);
      if (!updatedLikesCounter) {
        return false;
      }
      return true;
    }

    if (createdLikeOrDislike.isLikeDataEqualsDislike()) {
      comment.addDislikeCounter();
      const updatedLikesCounter = await this.CommentRepository.save(comment);
      if (!updatedLikesCounter) {
        return false;
      }
      return true;
    }
    return false;
  }

  async updateCommentLike(
    updateCommentLikeData: UpdateCommentLikeData
  ): Promise<boolean> {
    const likeData =
      await this.CommentLikesRepository.getLikeDataByParentIdAndCommentId(
        updateCommentLikeData.parentId,
        updateCommentLikeData.comment.id
      );

    if (!likeData) {
      const createdLike = await this.createLike(updateCommentLikeData);
      if (!createdLike) {
        return false;
      }
      return true;
    }

    const comment = await this.CommentRepository.getCommentByCommentId(
      updateCommentLikeData.comment.id
    );
    if (!comment) {
      return false;
    }

    if (likeData.isLikeDataEqualsLike()) {
      if (updateCommentLikeData.likeStatus === "Like") {
        return true;
      }

      if (updateCommentLikeData.likeStatus === "Dislike") {
        likeData.updateLikeStatus(updateCommentLikeData.likeStatus);
        const updatedToDislike =
          await this.CommentLikesRepository.save(likeData);

        if (!updatedToDislike) {
          return false;
        }

        comment.removeLikeAddDislikeCounter();
        const updatedLikesCounter = await this.CommentRepository.save(comment);
        if (!updatedLikesCounter) {
          return false;
        }
        return true;
      }

      if (updateCommentLikeData.likeStatus === "None") {
        const deletedLikeOrDislike =
          await this.CommentLikesRepository.deleteLikeOrDislike(likeData.id);
        if (!deletedLikeOrDislike) {
          return false;
        }

        comment.removeLikeCounter();
        const updatedLikesCounter = await this.CommentRepository.save(comment);
        if (!updatedLikesCounter) {
          return false;
        }
        return true;
      }
    }

    if (likeData.isLikeDataEqualsDislike()) {
      if (updateCommentLikeData.likeStatus === "Dislike") {
        return true;
      }

      if (updateCommentLikeData.likeStatus === "Like") {
        likeData.updateLikeStatus(updateCommentLikeData.likeStatus);
        const updatedToLike = await this.CommentLikesRepository.save(likeData);
        if (!updatedToLike) {
          return false;
        }
        comment.removeDislikeAddLikeCounter();
        const updatedLikesCounter = await this.CommentRepository.save(comment);
        if (!updatedLikesCounter) {
          return false;
        }
        return true;
      }

      if (updateCommentLikeData.likeStatus === "None") {
        const deletedDislike =
          await this.CommentLikesRepository.deleteLikeOrDislike(likeData.id);
        if (!deletedDislike) {
          return false;
        }
        comment.removeDislikeCounter();
        const updatedLikesCounter = await this.CommentRepository.save(comment);
        if (!updatedLikesCounter) {
          return false;
        }
        return true;
      }
    }

    if (likeData.isLikeDataEqualsNone()) {
      if (updateCommentLikeData.likeStatus === "None") {
        return true;
      }

      if (updateCommentLikeData.likeStatus === "Like") {
        likeData.updateLikeStatus(updateCommentLikeData.likeStatus);
        const updatedToLike = await this.CommentLikesRepository.save(likeData);
        if (!updatedToLike) {
          return false;
        }
        comment.addLikeCounter();
        const updatedLikesCounter = await this.CommentRepository.save(comment);
        if (!updatedLikesCounter) {
          return false;
        }
        return true;
      }

      if (updateCommentLikeData.likeStatus === "Dislike") {
        likeData.updateLikeStatus(updateCommentLikeData.likeStatus);
        const updatedToDislike =
          await this.CommentLikesRepository.save(likeData);
        if (!updatedToDislike) {
          return false;
        }
        comment.addDislikeCounter();
        const updatedLikesCounter = await this.CommentRepository.save(comment);
        if (!updatedLikesCounter) {
          return false;
        }
        return true;
      }
    }
    return false;
  }
}
