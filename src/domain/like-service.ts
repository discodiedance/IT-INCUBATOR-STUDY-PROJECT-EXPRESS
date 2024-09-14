import { QueryCommentLikeRepository } from "../repositories/query-repository/query-coment-ike-repository";
import { CommentRepository } from "../repositories/comment-repository";
import { LikeRepository } from "../repositories/like-repository";

import { ObjectId } from "mongodb";

import {
  InputCreateLikeData,
  InputUpdateCommentLikeData,
} from "../types/like/input";
import { CommentLikesDBType } from "../types/like/output";

export class LikeService {
  constructor(
    protected LikeRepository: LikeRepository,
    protected CommentRepository: CommentRepository,
    protected QueryCommentLikeRepository: QueryCommentLikeRepository
  ) {}
  async updateCommentLike(
    updateCommentLikeData: InputUpdateCommentLikeData
  ): Promise<boolean> {
    const likeData: CommentLikesDBType | null =
      await this.QueryCommentLikeRepository.findLikeDataByParentIdAndCommentId(
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

    if (likeData!.status === "Like") {
      if (updateCommentLikeData.likeStatus === "Like") {
        return true;
      }

      if (updateCommentLikeData.likeStatus === "Dislike") {
        const updatedToDisLike = await this.LikeRepository.updateLikeStatus(
          updateCommentLikeData.likeStatus,
          likeData!.id
        );
        if (!updatedToDisLike) {
          return false;
        }
        const removedLikeCounter =
          await this.CommentRepository.updateCommentLikeCounterRemove(
            updateCommentLikeData.comment.id
          );
        if (!removedLikeCounter) {
          return false;
        }
        const addedDislikeCounter =
          await this.CommentRepository.updateCommentDislikeCounterAdd(
            updateCommentLikeData.comment.id
          );
        if (!addedDislikeCounter) {
          return false;
        }
        return true;
      }

      if (updateCommentLikeData.likeStatus === "None") {
        const deletedLike = await this.LikeRepository.deleteLikeOrDislike(
          likeData!.id
        );
        if (!deletedLike) {
          return false;
        }
        const removedLikeCounter =
          await this.CommentRepository.updateCommentLikeCounterRemove(
            updateCommentLikeData.comment.id
          );
        if (!removedLikeCounter) {
          return false;
        }
        return true;
      }
    }

    if (likeData!.status === "Dislike") {
      if (updateCommentLikeData.likeStatus === "Dislike") {
        return true;
      }

      if (updateCommentLikeData.likeStatus === "Like") {
        const updatedToLike = await this.LikeRepository.updateLikeStatus(
          updateCommentLikeData.likeStatus,
          likeData!.id
        );
        if (!updatedToLike) {
          return false;
        }
        const removedDisLikeCounter =
          await this.CommentRepository.updateCommentDislikeCounterRemove(
            updateCommentLikeData.comment.id
          );
        if (!removedDisLikeCounter) {
          return false;
        }
        const addedLikeCounter =
          await this.CommentRepository.updateCommentLikeCounterAdd(
            updateCommentLikeData.comment.id
          );
        if (!addedLikeCounter) {
          return false;
        }
        return true;
      }

      if (updateCommentLikeData.likeStatus === "None") {
        const deletedDislike = await this.LikeRepository.deleteLikeOrDislike(
          likeData!.id
        );
        if (!deletedDislike) {
          return false;
        }
        const removedDislikeCounter =
          await this.CommentRepository.updateCommentDislikeCounterRemove(
            updateCommentLikeData.comment.id
          );
        if (!removedDislikeCounter) {
          return false;
        }
        return true;
      }
    }

    if (likeData!.status === "None") {
      if (updateCommentLikeData.likeStatus === "None") {
        return true;
      }

      if (updateCommentLikeData.likeStatus === "Like") {
        const updatedToLike = await this.LikeRepository.updateLikeStatus(
          updateCommentLikeData.likeStatus,
          likeData!.id
        );
        if (!updatedToLike) {
          return false;
        }
        const addedLikeCounter =
          await this.CommentRepository.updateCommentLikeCounterAdd(
            updateCommentLikeData.likeStatus
          );
        if (!addedLikeCounter) {
          return false;
        }
        return true;
      }

      if (updateCommentLikeData.likeStatus === "Dislike") {
        const updatedToDislike = await this.LikeRepository.updateLikeStatus(
          updateCommentLikeData.likeStatus,
          likeData!.id
        );
        if (!updatedToDislike) {
          return false;
        }
        const addedDislikeCounter =
          await this.CommentRepository.updateCommentDislikeCounterAdd(
            updateCommentLikeData.likeStatus
          );
        if (!addedDislikeCounter) {
          return false;
        }
        return true;
      }
    }
    return false;
  }

  async createLike(
    updateCommentLikeData: InputUpdateCommentLikeData
  ): Promise<boolean> {
    if (updateCommentLikeData.likeStatus === "None") {
      return true;
    }

    const createLikeData = new InputCreateLikeData(
      new ObjectId().toString(),
      updateCommentLikeData.comment.id,
      new Date(),
      updateCommentLikeData.likeStatus,
      updateCommentLikeData.parentId
    );

    const createdLikeOrDislike: CommentLikesDBType | null =
      await this.LikeRepository.createLikeOrDislike(createLikeData);
    if (!createdLikeOrDislike) {
      return false;
    }

    if (createdLikeOrDislike.status === "Like") {
      const countedLike =
        await this.CommentRepository.updateCommentLikeCounterAdd(
          updateCommentLikeData.comment.id
        );
      if (!countedLike) {
        return false;
      }
      return true;
    }

    if (createdLikeOrDislike.status === "Dislike") {
      const countedDislike =
        await this.CommentRepository.updateCommentDislikeCounterAdd(
          updateCommentLikeData.comment.id
        );
      if (!countedDislike) {
        return false;
      }
      return true;
    }
    return false;
  }
}
