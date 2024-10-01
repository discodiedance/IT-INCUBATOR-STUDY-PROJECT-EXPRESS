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
  removeLikeAddDislikeCounter: () => void;
  removeDislikeAddLikeCounter: () => void;
  removeLikeCounter: () => void;
  removeDislikeCounter: () => void;
  addLikeCounter: () => void;
  addDislikeCounter: () => void;
};

type CommentModelWithMethodsType = Model<
  CommentDBType,
  {},
  CommentDBMethodsType
>;

type CommentModelStaticType = Model<CommentDBType> & {
  createComment(newComment: CreateCommentDataType): CommentDocumentType;
};

export type CommentModelFullType = CommentModelWithMethodsType &
  CommentModelStaticType;

export type CommentDocumentType = HydratedDocument<
  CommentDBType,
  CommentDBMethodsType
>;
