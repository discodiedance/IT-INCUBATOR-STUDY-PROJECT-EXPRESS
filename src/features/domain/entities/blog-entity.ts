import mongoose from "mongoose";

import {
  BlogDBMethodsType,
  BlogModelFullType,
} from "../../../types/blog/blog-entities";
import { ObjectId } from "mongodb";
import {
  BlogDBType,
  CreateBlogDataType,
  UpdateBlogDataType,
} from "../../../types/blog/blog-dto";

export const BlogSchema = new mongoose.Schema<
  BlogDBType,
  BlogModelFullType,
  BlogDBMethodsType
>({
  id: { type: String, require: true },
  name: { type: String, require: true },
  description: { type: String, require: true },
  websiteUrl: { type: String, require: true },
  createdAt: { type: String, require: true },
  isMembership: { type: Boolean, default: false, require: true },
});

BlogSchema.static(
  "createBlog",
  function createBlog(newBlog: CreateBlogDataType) {
    const blog = new this();

    (blog.id = new ObjectId().toString()),
      (blog.name = newBlog.name),
      (blog.description = newBlog.description),
      (blog.websiteUrl = newBlog.websiteUrl),
      (blog.createdAt = new Date().toISOString()),
      (blog.isMembership = false);

    return blog;
  }
);

BlogSchema.method(
  "updateBlog",
  function updateBlog(updateData: UpdateBlogDataType) {
    (this.name = updateData.name),
      (this.description = updateData.description),
      (this.websiteUrl = updateData.websiteUrl);
  }
);

export const BlogModel = mongoose.model<BlogDBType, BlogModelFullType>(
  "blogs",
  BlogSchema
);
