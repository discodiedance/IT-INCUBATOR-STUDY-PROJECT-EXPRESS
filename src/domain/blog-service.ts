import { ObjectId } from "mongodb";
import { blogCollection } from "../db/db";
import { PostRepository } from "../repositories/post-repository";
import { QueryBlogRepository } from "../repositories/query-repository/query-blog-repository";
import { InputBlogType, UpdateBlogData } from "../types/blog/input";
import { BlogType } from "../types/blog/output";

export class BlogService {
  static async createBlog(newBlog: InputBlogType): Promise<BlogType> {
    const createdBlog: BlogType = {
      name: newBlog.name,
      description: newBlog.description,
      websiteUrl: newBlog.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };

    const result = await blogCollection.insertOne({ ...createdBlog });
    createdBlog.id = result.insertedId.toString();
    return createdBlog;
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

  static async updateBlog(
    id: string,
    updateData: UpdateBlogData
  ): Promise<boolean> {
    const result = await blogCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: updateData.name,
          description: updateData.description,
          webisteUrl: updateData.websiteUrl,
        },
      }
    );

    return !!result.matchedCount;
  }
}
