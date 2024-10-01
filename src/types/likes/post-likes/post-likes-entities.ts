import { HydratedDocument, Model } from "mongoose";
import { PostLikesDBType, CreatePostLikeData } from "./post-likes-dto";

export type PostLikesDBMethodsType = {
  isLikeDataEqualsLike: () => boolean;
  isLikeDataEqualsDislike: () => boolean;
  isLikeDataEqualsNone: () => boolean;
  updateLikeStatus: (status: "None" | "Like" | "Dislike") => void;
  updateFirstReaction: () => void;
  updateToDeletedLikeOrDislike: () => void;
  returnFromDeleted: (status: "None" | "Like" | "Dislike") => void;
};

type PostLikesModelWithMethodsType = Model<
  PostLikesDBType,
  {},
  PostLikesDBMethodsType
>;

type PostLikesModelStaticType = Model<PostLikesDBType> & {
  createLike(newLike: CreatePostLikeData): PostLikesDocumentType;
};

export type PostLikesModelFullType = PostLikesModelWithMethodsType &
  PostLikesModelStaticType;

export type PostLikesDocumentType = HydratedDocument<
  PostLikesDBType,
  PostLikesDBMethodsType
>;
