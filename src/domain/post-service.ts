import { InputPostType, UpdatePostData } from "../types/post/input";
import { OutputPostType, PostDBType } from "../types/post/output";
import { PostRepository } from "../repositories/post-repository";
import {
  InputCommentBodyWithPostId,
  InputCreateCommentData,
} from "../types/comment/input";
import { CommentDBType, OutputCommentType } from "../types/comment/output";
import { ObjectId } from "mongodb";
import { postMapper } from "./../middlewares/post/post-mapper";
import { commentMapper } from "./../middlewares/comment/comment-mapper";

export class PostService {
  static async createPost(newPost: InputPostType): Promise<OutputPostType> {
    const createdPost: PostDBType = {
      id: new ObjectId().toString(),
      title: newPost.title,
      shortDescription: newPost.shortDescription,
      content: newPost.content,
      blogId: newPost.blogId,
      blogName: newPost.blogName,
      createdAt: new Date().toISOString(),
    };
    await PostRepository.createPost(createdPost);
    return postMapper(createdPost);
  }

  static async createComment(
    newComment: InputCommentBodyWithPostId
  ): Promise<OutputCommentType> {
    const createdComment: CommentDBType = {
      content: newComment.content,
      commentatorInfo: newComment.commentatorInfo,
      postId: newComment.postId,
      id: new ObjectId().toString(),
      createdAt: new Date().toISOString(),
    };

    await PostRepository.createComment(createdComment);

    return commentMapper(createdComment);
  }

  static async createCommentToPost(
    createCommentData: InputCreateCommentData
  ): Promise<OutputCommentType> {
    const comment: OutputCommentType = await this.createComment({
      content: createCommentData.content,
      commentatorInfo: {
        userId: createCommentData.userId,
        userLogin: createCommentData.login,
      },
      postId: createCommentData.postId,
    });

    return comment;
  }

  static async updatePost(
    id: string,
    updateData: UpdatePostData
  ): Promise<boolean> {
    const updatedPost: UpdatePostData = {
      title: updateData.title,
      shortDescription: updateData.shortDescription,
      content: updateData.content,
      blogId: updateData.blogId,
    };
    const result = await PostRepository.updatePost(id, updatedPost);
    return result;
  }
}
