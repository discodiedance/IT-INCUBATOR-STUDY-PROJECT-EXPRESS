import { HydratedDocument, Model } from "mongoose";
import { CommentLikesDBType, CreateCommentLikeData } from "./comment-likes-dto";

export type CommentLikesDBMethodsType = {
  isLikeDataEqualsLike: () => boolean;
  isLikeDataEqualsDislike: () => boolean;
  isLikeDataEqualsNone: () => boolean;
  updateLikeStatus: (status: "None" | "Like" | "Dislike") => void;
};

type CommentLikesModelWithMethodsType = Model<
  CommentLikesDBType,
  {},
  CommentLikesDBMethodsType
>;

type CommentLikesModelStaticType = Model<CommentLikesDBType> & {
  createLike(newLike: CreateCommentLikeData): CommentLikesDocumentType;
};

export type CommentLikesModelFullType = CommentLikesModelWithMethodsType &
  CommentLikesModelStaticType;

export type CommentLikesDocumentType = HydratedDocument<
  CommentLikesDBType,
  CommentLikesDBMethodsType
>;
