import { Model, HydratedDocument } from "mongoose";

import { OutputUserType } from "../user/output";

import {
  CommentDBType,
  CreateCommentDataType,
  UpdateCommentDataType,
} from "./comment-dto";

export type CommentDBMethodsType = {
  isCommentatorIdAndLoginEqual: (user: OutputUserType) => boolean;
  updateComment: (content: UpdateCommentDataType) => void;
  removeLikeAddDislikeCounter: () => boolean;
  removeDislikeAddLikeCounter: () => boolean;
  removeLikeCounter: () => boolean;
  removeDislikeCounter: () => boolean;
  addLikeCounter: () => boolean;
  addDislikeCounter: () => boolean;
};

type CommentModelWithMethodsType = Model<
  CommentDBType,
  {},
  CommentDBMethodsType
>;

type CommentModelStaticType = Model<CommentDBType> & {
  createComment(newPost: CreateCommentDataType): CommentDocumentType;
};

export type CommentModelFullType = CommentModelWithMethodsType &
  CommentModelStaticType;

export type CommentDocumentType = HydratedDocument<
  CommentDBType,
  CommentDBMethodsType
>;
