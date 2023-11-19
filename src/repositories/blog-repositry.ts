import { db } from "../db/db";

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
}
