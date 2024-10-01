import mongoose from "mongoose";
import {
  PostDBMethodsType,
  PostModelFullType,
} from "../../../types/post/post-entities";
import { ObjectId } from "mongodb";
import {
  CreatePostDataType,
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
  likesInfo: {
    likesCount: { type: Number, require: true },
    dislikesCount: { type: Number, require: true },
    newestLikes: { type: Array, require: true },
  },
});

PostSchema.static(
  "createPost",
  function createPost(newPost: CreatePostDataType) {
    const post = new this();

    post.id = new ObjectId().toString();
    post.title = newPost.title;
    post.shortDescription = newPost.shortDescription;
    post.content = newPost.content;
    post.blogId = newPost.blogId;
    post.blogName = newPost.blogName;
    post.createdAt = new Date().toISOString();
    post.likesInfo = {
      likesCount: 0,
      dislikesCount: 0,
    };
    post.newestLikes = [];

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

PostSchema.method(
  "removeLikeAddDislikeCounter",
  function removeLikeAddDislikeCounter() {
    this.likesInfo.likesCount -= 1;
    this.likesInfo.dislikesCount += 1;
  }
);

PostSchema.method(
  "removeDislikeAddLikeCounter",
  function removeDislikeAddLikeCounter() {
    this.likesInfo.likesCount += 1;
    this.likesInfo.dislikesCount -= 1;
  }
);

PostSchema.method("removeLikeCounter", function removeLikeCounter() {
  this.likesInfo.likesCount -= 1;
});

PostSchema.method("removeDislikeCounter", function removeDislikeCounter() {
  this.likesInfo.dislikesCount -= 1;
});

PostSchema.method("addLikeCounter", function addLikeCounter() {
  this.likesInfo.likesCount += 1;
});

PostSchema.method("addDislikeCounter", function addDislikeCounter() {
  this.likesInfo.dislikesCount += 1;
});

export const PostModel = mongoose.model<PostDBType, PostModelFullType>(
  "posts",
  PostSchema
);
