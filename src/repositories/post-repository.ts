import { db } from "../db/db";
import { PostType } from "../types/post/output";

export class PostRepository {
  static getAllPosts() {
    return db.blogs;
  }
  static getPostById(id: string) {
    const post = db.posts.find((p) => p.id == id);

    if (!post) {
      return null;
    }
    return post;
  }
  static createNewPost(createdPost: PostType) {
    const newPost = db.posts.push(createdPost);
    return newPost;
  }
}
