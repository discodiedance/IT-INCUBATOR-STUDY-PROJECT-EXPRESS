import { PostRepository } from "../repositories/post-repository";

import { postMapper } from "./../middlewares/post/post-mapper";
import { commentMapperWithStatus } from "./../middlewares/comment/comment-mapper";

import { ObjectId } from "mongodb";

import { InputPostType, UpdatePostData } from "../types/post/input";
import { OutputPostType, PostDBType } from "../types/post/output";
import {
  CreateCommentData,
  InputCommentBodyWithPostId,
  InputCreateCommentData,
} from "../types/comment/input";
import { CommentDBType, OutputCommentType } from "../types/comment/output";

export class PostService {
  constructor(protected PostRepository: PostRepository) {}
  async createPost(postData: InputPostType): Promise<OutputPostType> {
    const createdPost = new PostDBType(
      new ObjectId().toString(),
      postData.title,
      postData.shortDescription,
      postData.content,
      postData.blogId,
      postData.blogName,
      new Date().toISOString()
    );

    const newPost = await this.PostRepository.createPost(createdPost);
    return postMapper(newPost);
  }

  async createComment(
    newComment: InputCommentBodyWithPostId,
    userId: string
  ): Promise<OutputCommentType> {
    const createCommentData = new CreateCommentData(
      userId,
      newComment.content,
      newComment.commentatorInfo,
      new Date().toISOString(),
      {
        likesCount: 0,
        dislikesCount: 0,
      }
    );

    const createdComment =
      await this.PostRepository.createComment(createCommentData);

    return await commentMapperWithStatus(createdComment, userId);
  }

  async createCommentToPost(
    createCommentData: InputCreateCommentData,
    userId: string
  ): Promise<OutputCommentType> {
    const comment: OutputCommentType | null = await this.createComment(
      {
        content: createCommentData.content,
        commentatorInfo: {
          userId: createCommentData.userId,
          userLogin: createCommentData.login,
        },
        postId: createCommentData.postId,
      },
      userId
    );
    return comment;
  }

  async updatePost(id: string, updateData: UpdatePostData): Promise<boolean> {
    const updatedPost = new UpdatePostData(
      updateData.title,
      updateData.shortDescription,
      updateData.content,
      updateData.blogId
    );

    const result = await this.PostRepository.updatePost(id, updatedPost);
    return result;
  }
}
