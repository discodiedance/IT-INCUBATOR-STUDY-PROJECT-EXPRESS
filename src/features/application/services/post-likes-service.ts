import { inject, injectable } from "inversify";
import { CreatePostLikeData } from "../../../types/likes/post-likes/post-likes-dto";
import { PostLikesModel } from "../../domain/entities/post-likes-entity";
import { PostRepository } from "../../infrastructure/repositories/post-repository";
import { QueryPostRepository } from "../../infrastructure/repositories/query-repository/query-post-repository";
import { PostLikesRepository } from "../../infrastructure/repositories/post-likes-repository";

@injectable()
export class PostLikesService {
  constructor(
    @inject(QueryPostRepository)
    protected QueryPostRepository: QueryPostRepository,
    @inject(PostLikesRepository)
    protected PostLikesRepository: PostLikesRepository,
    @inject(PostRepository) protected PostRepository: PostRepository
  ) {}

  async createLike(updatePostLikeData: CreatePostLikeData): Promise<boolean> {
    if (updatePostLikeData.likeStatus === "None") {
      return true;
    }

    const post = await this.PostRepository.getPostByPostId(
      updatePostLikeData.post.id
    );

    if (!post) {
      return false;
    }

    const createdLikeOrDislike = PostLikesModel.createLike(updatePostLikeData);

    const createdLikeOrDislikeData =
      await this.PostLikesRepository.save(createdLikeOrDislike);
    if (!createdLikeOrDislikeData) {
      return false;
    }

    if (createdLikeOrDislike.isLikeDataEqualsLike()) {
      post.addLikeCounter();
      const updatedLikesCounter = await this.PostRepository.save(post);

      if (!updatedLikesCounter) {
        return false;
      }
      return true;
    }

    if (createdLikeOrDislike.isLikeDataEqualsDislike()) {
      post.addDislikeCounter();
      const updatedLikesCounter = await this.PostRepository.save(post);
      if (!updatedLikesCounter) {
        return false;
      }
      return true;
    }
    return false;
  }

  async updatePostLike(
    updatePostLikeData: CreatePostLikeData
  ): Promise<boolean> {
    const likeData =
      await this.PostLikesRepository.getLikeDataByParentIdAndPostId(
        updatePostLikeData.parentId,
        updatePostLikeData.post.id
      );

    if (!likeData) {
      const createdLike = await this.createLike(updatePostLikeData);
      if (!createdLike) {
        return false;
      }
      return true;
    }
    const post = await this.PostRepository.getPostByPostId(
      updatePostLikeData.post.id
    );

    if (!post) {
      return false;
    }

    if (likeData.isLikeDataEqualsLike()) {
      if (updatePostLikeData.likeStatus === "Like") {
        return true;
      }

      if (updatePostLikeData.likeStatus === "Dislike") {
        likeData.updateLikeStatus(updatePostLikeData.likeStatus);
        likeData.updateFirstReaction();
        const updatedToDislike = await this.PostLikesRepository.save(likeData);

        if (!updatedToDislike) {
          return false;
        }

        post.removeLikeAddDislikeCounter();
        const updatedLikesCounter = await this.PostRepository.save(post);
        if (!updatedLikesCounter) {
          return false;
        }
        return true;
      }

      if (updatePostLikeData.likeStatus === "None") {
        likeData.updateToDeletedLikeOrDislike();
        likeData.updateFirstReaction();
        const updatedToDeletedLikeOrDislike =
          await this.PostLikesRepository.save(likeData);

        if (!updatedToDeletedLikeOrDislike) {
          return false;
        }

        post.removeLikeCounter();
        const updatedLikesCounter = await this.PostRepository.save(post);
        if (!updatedLikesCounter) {
          return false;
        }
        return true;
      }
    }

    if (likeData.isLikeDataEqualsDislike()) {
      if (updatePostLikeData.likeStatus === "Dislike") {
        return true;
      }

      if (updatePostLikeData.likeStatus === "Like") {
        likeData.updateLikeStatus(updatePostLikeData.likeStatus);
        likeData.updateFirstReaction();
        const updatedToLike = await this.PostLikesRepository.save(likeData);
        if (!updatedToLike) {
          return false;
        }
        post.removeDislikeAddLikeCounter();
        const updatedLikesCounter = await this.PostRepository.save(post);
        if (!updatedLikesCounter) {
          return false;
        }
        return true;
      }

      if (updatePostLikeData.likeStatus === "None") {
        likeData.updateToDeletedLikeOrDislike();
        likeData.updateFirstReaction();
        const updatedToDeletedLikeOrDislike =
          await this.PostLikesRepository.save(likeData);

        if (!updatedToDeletedLikeOrDislike) {
          return false;
        }

        post.removeDislikeCounter();
        const updatedLikesCounter = await this.PostRepository.save(post);
        if (!updatedLikesCounter) {
          return false;
        }
        return true;
      }
    }

    if (likeData.isLikeDataEqualsNone()) {
      if (updatePostLikeData.likeStatus === "None") {
        return true;
      }

      if (updatePostLikeData.likeStatus === "Like") {
        likeData.returnFromDeleted(updatePostLikeData.likeStatus);
        const updatedToLike = await this.PostLikesRepository.save(likeData);
        if (!updatedToLike) {
          return false;
        }
        post.addLikeCounter();
        const updatedLikesCounter = await this.PostRepository.save(post);
        if (!updatedLikesCounter) {
          return false;
        }
        return true;
      }

      if (updatePostLikeData.likeStatus === "Dislike") {
        likeData.returnFromDeleted(updatePostLikeData.likeStatus);
        const updatedToDislike = await this.PostLikesRepository.save(likeData);
        if (!updatedToDislike) {
          return false;
        }
        post.addDislikeCounter();
        const updatedLikesCounter = await this.PostRepository.save(post);
        if (!updatedLikesCounter) {
          return false;
        }
        return true;
      }
    }
    return false;
  }
}
