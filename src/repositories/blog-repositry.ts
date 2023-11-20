import { db } from "../db/db";
import { BlogType } from "../types/blog/output";

export class BlogRepository {
  static getAllBlogs() {
    return db.blogs;
  }
  static getBlogById(id: string) {
    const blog = db.blogs.find((b) => b.id == id);

    if (!blog) {
      return null;
    }
    return blog;
  }

  static createBlog(createdBlog: BlogType) {
    const newBlog = db.blogs.push(createdBlog);
    return newBlog;
  }
}
