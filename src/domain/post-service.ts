import { PostRepository } from "../repositories/post-repository";
import { InputPostType } from "../types/post/input";

export class PostService {
  static async createPost(newPost: InputPostType) {
    const post = await PostRepository.createPost(newPost);
    return post;
  }
}
