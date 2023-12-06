import { BlogRepository } from "../repositories/blog-repositry";
import { PostRepository } from "../repositories/post-repository";
import { QueryBlogRepository } from "../repositories/query-repository/query-blog-repository";
import { InputBlogType } from "../types/blog/input";

export class BlogService {
  static async createBlog(newBlog: InputBlogType) {
    const blog = await BlogRepository.createBlog(newBlog);
    return blog;
  }

  static async createPostToBlog(
    blogId: string,
    postData: {
      title: string;
      shortDescription: string;
      content: string;
    }
  ) {
    const blog = await QueryBlogRepository.getBlogById(blogId);

    if (!blog) {
      return null;
    }

    const post = await PostRepository.createPost({
      ...postData,
      blogId,
      blogName: blog.name,
    });

    return post;
  }
}
