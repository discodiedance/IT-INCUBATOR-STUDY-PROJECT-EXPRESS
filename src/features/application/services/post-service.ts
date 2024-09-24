import { inject, injectable } from "inversify";

import { OutputPostType } from "../../../types/post/output";

import { OutputCommentType } from "../../../types/comment/output";
import { PostRepository } from "../../infrastructure/repositories/post-repository";

import { PostModel } from "../../domain/entities/post-entity";
import { CommentModel } from "../../domain/entities/comment-enitity";
import { CommentRepository } from "../../infrastructure/repositories/comment-repository";
import { PostDocumentType } from "../../../types/post/post-entities";
import {
  CreateCommentDataType,
  CreateCommentToPostDataType,
} from "../../../types/comment/comment-dto";
import {
  CreatePostTypeDataType,
  UpdatePostDataType,
} from "../../../types/post/post-dto";
import { commentMapperWithStatus } from "../mappers/comment/comment-mapper";
import { postMapper } from "../mappers/post/post-mapper";

@injectable()
export class PostService {
  constructor(
    @inject(PostRepository) protected PostRepository: PostRepository,
    @inject(CommentRepository) protected CommentRepository: CommentRepository
  ) {}

  async createPost(
    inputPostData: CreatePostTypeDataType
  ): Promise<OutputPostType> {
    const createdPost = PostModel.createPost(inputPostData);
    await this.PostRepository.save(createdPost);
    return postMapper(createdPost);
  }

  async createComment(
    newComment: CreateCommentDataType
  ): Promise<OutputCommentType | null> {
    const createdComment = CommentModel.createComment(newComment);
    const comment = await this.CommentRepository.save(createdComment);
    if (!comment) {
      return null;
    }
    return await commentMapperWithStatus(
      createdComment,
      newComment.commentatorInfo.userId
    );
  }

  async createCommentToPost(
    inputCreateCommentData: CreateCommentToPostDataType
  ): Promise<OutputCommentType | null> {
    const commentData = await this.createComment({
      content: inputCreateCommentData.content,
      commentatorInfo: {
        userId: inputCreateCommentData.userId,
        userLogin: inputCreateCommentData.login,
      },
      postId: inputCreateCommentData.postId,
    });
    return commentData;
  }

  async updatePost(
    post: PostDocumentType,
    updateData: UpdatePostDataType
  ): Promise<boolean> {
    post.updatePost(updateData);
    const updatedPost = await this.PostRepository.save(post);
    if (!updatedPost) {
      return false;
    }
    return true;
  }
}
