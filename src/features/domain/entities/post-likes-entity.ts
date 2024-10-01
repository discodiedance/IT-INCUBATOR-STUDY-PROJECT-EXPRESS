import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import {
  PostLikesDBType,
  CreatePostLikeData,
} from "../../../types/likes/post-likes/post-likes-dto";
import {
  PostLikesModelFullType,
  PostLikesDBMethodsType,
} from "../../../types/likes/post-likes/post-likes-entities";

export const PostLikesSchema = new mongoose.Schema<
  PostLikesDBType,
  PostLikesModelFullType,
  PostLikesDBMethodsType
>({
  id: { type: String, require: true },
  postId: { type: String, require: true },
  createdAt: { type: String, require: true },
  status: { type: String, default: "None", require: true },
  parentId: { type: String, require: true },
  parentLogin: { type: String, require: true },
  isFirstReaction: { type: Boolean, default: true, require: true },
  isDeleted: { type: Boolean, default: false, require: true },
});

PostLikesSchema.static(
  "createLike",
  function createLike(newLike: CreatePostLikeData) {
    const likeData = new this();

    (likeData.id = new ObjectId().toString()),
      (likeData.postId = newLike.post.id),
      (likeData.createdAt = new Date().toISOString()),
      (likeData.status = newLike.likeStatus),
      (likeData.parentId = newLike.parentId),
      (likeData.parentLogin = newLike.parentLogin),
      (likeData.isFirstReaction = true),
      (likeData.isDeleted = false);

    return likeData;
  }
);

PostLikesSchema.method(
  "updateToDeletedLikeOrDislike",
  function updateToDeletedLikeOrDislike() {
    this.status = "None";
    this.isDeleted = true;
  }
);

PostLikesSchema.method(
  "returnFromDeleted",
  function returnFromDeleted(status: "None" | "Like" | "Dislike") {
    this.isDeleted = false;
    this.status = status;
  }
);

PostLikesSchema.method("updateFirstReaction", function updateFirstReaction() {
  this.isFirstReaction = false;
});

PostLikesSchema.method("isLikeDataEqualsLike", function isLikeDataEqualsLike() {
  return this.status === "Like";
});

PostLikesSchema.method(
  "isLikeDataEqualsDislike",
  function isLikeDataEqualsDislike() {
    return this.status === "Dislike";
  }
);

PostLikesSchema.method("isLikeDataEqualsNone", function isLikeDataEqualsNone() {
  return this.status === "None";
});

PostLikesSchema.method(
  "updateLikeStatus",
  function updateLikeStatus(status: "None" | "Like" | "Dislike") {
    this.status = status;
  }
);

export const PostLikesModel = mongoose.model<
  PostLikesDBType,
  PostLikesModelFullType
>("postLikes", PostLikesSchema);
