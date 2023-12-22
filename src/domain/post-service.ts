import { InputPostType, UpdatePostData } from "../types/post/input";
import { PostType } from "../types/post/output";
import { PostRepository } from "../repositories/post-repository";

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
