import { Model, HydratedDocument } from "mongoose";

import {
  CreatePostTypeDataType,
  PostDBType,
  UpdatePostDataType,
} from "./post-dto";

export type PostDBMethodsType = {
  updatePost: (newPost: UpdatePostDataType) => void;
};

type PostModelWithMethodsType = Model<PostDBType, {}, PostDBMethodsType>;

type PostModelStaticType = Model<PostDBType> & {
  createPost(newPost: CreatePostTypeDataType): PostDocumentType;
};

export type PostModelFullType = PostModelWithMethodsType & PostModelStaticType;

export type PostDocumentType = HydratedDocument<PostDBType, PostDBMethodsType>;
