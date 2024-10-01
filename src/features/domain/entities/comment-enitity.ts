import mongoose from "mongoose";
import { OutputUserType } from "../../../types/user/output";
import {
  CommentModelFullType,
  CommentDBMethodsType,
} from "../../../types/comment/comment-entities";
import { ObjectId } from "mongodb";
import {
  CommentDBType,
  CreateCommentDataType,
  UpdateCommentDataType,
} from "../../../types/comment/comment-dto";

export const CommentSchema = new mongoose.Schema<
  CommentDBType,
  CommentModelFullType,
  CommentDBMethodsType
>({
  id: { type: String, require: true },
  content: { type: String, require: true },
  commentatorInfo: {
    userId: { type: String, require: true },
    userLogin: { type: String, require: true },
  },
  createdAt: { type: String, require: true },
  postId: { type: String, require: true },
  likesInfo: {
    likesCount: { type: Number, require: true },
    dislikesCount: { type: Number, require: true },
  },
});

CommentSchema.static(
  "createComment",
  function createComment(newComment: CreateCommentDataType) {
    const comment = new this();

    comment.id = new ObjectId().toString();
    comment.content = newComment.content;
    comment.commentatorInfo = newComment.commentatorInfo;
    comment.createdAt = new Date().toISOString();
    comment.postId = newComment.postId;
    comment.likesInfo = {
      likesCount: 0,
      dislikesCount: 0,
    };

    return comment;
  }
);

CommentSchema.method(
  "isCommentatorIdAndLoginEqual",
  function isCommentatorIdAndLoginEqual(user: OutputUserType) {
    return (
      this.commentatorInfo.userId == user.id &&
      this.commentatorInfo.userLogin == user.login
    );
  }
);

CommentSchema.method(
  "updateComment",
  function updateComment(content: UpdateCommentDataType) {
    this.content = content.content;
  }
);

CommentSchema.method(
  "removeLikeAddDislikeCounter",
  function removeLikeAddDislikeCounter() {
    this.likesInfo.likesCount -= 1;
    this.likesInfo.dislikesCount += 1;
  }
);

CommentSchema.method(
  "removeDislikeAddLikeCounter",
  function removeLikeAddDislikeCounter() {
    this.likesInfo.likesCount -= 1;
    this.likesInfo.dislikesCount += 1;
  }
);

CommentSchema.method("removeLikeCounter", function removeLikeCounter() {
  this.likesInfo.likesCount -= 1;
});

CommentSchema.method("removeDislikeCounter", function removeDislikeCounter() {
  this.likesInfo.dislikesCount -= 1;
});

CommentSchema.method("addLikeCounter", function addLikeCounter() {
  this.likesInfo.likesCount += 1;
});

CommentSchema.method("addDislikeCounter", function addDislikeCounter() {
  this.likesInfo.dislikesCount += 1;
});

export const CommentModel = mongoose.model<CommentDBType, CommentModelFullType>(
  "comments",
  CommentSchema
);
