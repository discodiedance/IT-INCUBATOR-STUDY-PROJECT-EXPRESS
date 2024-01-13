import { InputPostType, UpdatePostData } from "../types/post/input";
import { PostType } from "../types/post/output";
import { PostRepository } from "../repositories/post-repository";
import { InputCommentType } from "../types/comment/input";
import { CommentType } from "../types/comment/output";

export class PostService {
  static async createPost(newPost: InputPostType): Promise<PostType> {
    const createdPost: PostType = {
      title: newPost.title,
      shortDescription: newPost.shortDescription,
      content: newPost.content,
      blogId: newPost.blogId,
      blogName: newPost.blogName,
      createdAt: new Date().toISOString(),
    };
    await PostRepository.createPost(createdPost);
    return createdPost;
  }

  static async createComment(
    newComment: InputCommentType
  ): Promise<CommentType> {
    const createdComment: CommentType = {
      content: newComment.content,
      commentatorInfo: newComment.commentatorInfo,
      postId: newComment.postId,
      createdAt: new Date().toISOString(),
    };
    const comment = await PostRepository.createComment(createdComment);
    return comment;
  }

  static async createCommentToPost(
    postId: string,
    content: string,
    userId: string,
    userLogin: string
  ) {
    // const post = await QueryPostRepository.getPostById(postId);

    // if (!post) {
    //   return null;
    // }

    const comment = await PostService.createComment({
      content,
      postId,
      commentatorInfo: {
        userId,
        userLogin,
      },
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
      blogName: updateData.blogName,
    };
    const result = await PostRepository.updatePost(id, updatedPost);
    return !!result.matchedCount;
  }
}
