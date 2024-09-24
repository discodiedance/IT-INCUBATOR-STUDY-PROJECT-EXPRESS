import mongoose from "mongoose";

import {
  PostDBMethodsType,
  PostModelFullType,
} from "../../../types/post/post-entities";

import { ObjectId } from "mongodb";
import {
  CreatePostTypeDataType,
  PostDBType,
  UpdatePostDataType,
} from "../../../types/post/post-dto";

export const PostSchema = new mongoose.Schema<
  PostDBType,
  PostModelFullType,
  PostDBMethodsType
>({
  id: { type: String, require: true },
  title: { type: String, require: true },
  shortDescription: { type: String, required: true },
  content: { type: String, require: true },
  blogId: { type: String, require: true },
  blogName: { type: String, require: true },
  createdAt: { type: String, require: true },
});

PostSchema.static(
  "createPost",
  function createPost(newPost: CreatePostTypeDataType, blogName: string) {
    const post = new this();

    post.id = new ObjectId();
    post.title = newPost.title;
    post.shortDescription = newPost.shortDescription;
    post.content = newPost.content;
    post.blogId = newPost.blogId;
    post.blogName = blogName;
    post.createdAt = new Date().toISOString();

    return post;
  }
);

PostSchema.method(
  "updatePost",
  function updatePost(updatePostData: UpdatePostDataType) {
    this.title = updatePostData.title;
    this.shortDescription = updatePostData.shortDescription;
    this.content = updatePostData.content;
    this.blogId = updatePostData.blogId;
  }
);

export const PostModel = mongoose.model<PostDBType, PostModelFullType>(
  "posts",
  PostSchema
);
