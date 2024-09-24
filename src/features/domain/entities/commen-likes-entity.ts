import mongoose from "mongoose";

import {
  CommentLikesDBMethodsType,
  CommentLikesModelFullType,
} from "../../../types/comment-likes/comment-likes-entities";

import { ObjectId } from "mongodb";
import {
  CommentLikesDBType,
  CreateCommentLikeData,
} from "../../../types/comment-likes/comment-likes-dto";

export const CommentLikesSchema = new mongoose.Schema<
  CommentLikesDBType,
  CommentLikesModelFullType,
  CommentLikesDBMethodsType
>({
  id: { type: String, require: true },
  commentId: { type: String, require: true },
  createdAt: { type: String, require: true },
  status: { type: String, default: "None", require: true },
  parentId: { type: String, require: true },
});

CommentLikesSchema.static(
  "createLike",
  function createLike(newLike: CreateCommentLikeData) {
    const likeData = new this();

    (likeData.id = new ObjectId().toString()),
      (likeData.commentId = newLike.comment.id),
      (likeData.createdAt = new Date().toISOString()),
      (likeData.status = newLike.likeStatus),
      (likeData.parentId = newLike.parentId);

    return likeData;
  }
);

CommentLikesSchema.method(
  "isLikeDataEqualsLike",
  function isLikeDataEqualsLike() {
    return this.status === "Like";
  }
);

CommentLikesSchema.method(
  "isLikeDataEqualsDislike",
  function isLikeDataEqualsDislike() {
    return this.status === "Dislike";
  }
);

CommentLikesSchema.method(
  "isLikeDataEqualsNone",
  function isLikeDataEqualsNone() {
    return this.status === "None";
  }
);

CommentLikesSchema.method(
  "updateLikeStatus",
  function updateLikeStatus(status: "None" | "Like" | "Dislike") {
    this.status = status;
    return true;
  }
);

export const CommentLikesModel = mongoose.model<
  CommentLikesDBType,
  CommentLikesModelFullType
>("commentLikes", CommentLikesSchema);
