import { Model, HydratedDocument } from "mongoose";
import { CreatePostDataType, PostDBType, UpdatePostDataType } from "./post-dto";

export type PostDBMethodsType = {
  updatePost: (newPost: UpdatePostDataType) => void;
  removeLikeAddDislikeCounter: () => void;
  removeDislikeAddLikeCounter: () => void;
  removeLikeCounter: () => void;
  removeDislikeCounter: () => void;
  addLikeCounter: () => void;
  addDislikeCounter: () => void;
};

type PostModelWithMethodsType = Model<PostDBType, {}, PostDBMethodsType>;

type PostModelStaticType = Model<PostDBType> & {
  createPost(newPost: CreatePostDataType): PostDocumentType;
};

export type PostModelFullType = PostModelWithMethodsType & PostModelStaticType;

export type PostDocumentType = HydratedDocument<PostDBType, PostDBMethodsType>;
