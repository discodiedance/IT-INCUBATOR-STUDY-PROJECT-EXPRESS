import dotenv from "dotenv";
import { mongoUri } from "../config";
import mongoose from "mongoose";

import { BlogDBType } from "../types/blog/output";
import { UserDBType } from "../types/user/output";
import { CommentDBType } from "../types/comment/output";
import { APIReqeustsType } from "../types/common";
import { DeviceDBType } from "../types/security/input";
import { PostDBType } from "../types/post/output";
import { CommentLikesDBType } from "../types/like/output";

dotenv.config();

const dbName = "minigram";
const mongoURI = process.env.MONGO_URL || `mongodb://0.0.0.0:27017/${dbName}`;

export const BlogSchema = new mongoose.Schema<BlogDBType>({
  id: { type: String, require: true },
  name: { type: String, require: true },
  description: { type: String, require: true },
  websiteUrl: { type: String, require: true },
  createdAt: { type: String, require: true },
  isMembership: { type: Boolean, default: false, require: true },
});
export const BlogModel = mongoose.model<BlogDBType>("blogs", BlogSchema);

export const UserSchema = new mongoose.Schema<UserDBType>({
  id: { type: String, require: true },
  accountData: {
    email: { type: String, require: true },
    login: { type: String, require: true },
    passwordHash: { type: String, require: true },
    passwordSalt: { type: String, require: true },
    createdAt: { type: Date, require: true },
  },
  emailConfirmation: {
    confirmationCode: { type: String, require: true },
    expirationDate: { type: Date, require: true },
    isConfirmed: { type: Boolean, require: true },
  },
  passwordRecoveryConfirmation: {
    recoveryCode: { type: String, require: true },
    expirationDate: { type: Date, require: true },
  },
});
export const UserModel = mongoose.model<UserDBType>("users", UserSchema);

export const PostSchema = new mongoose.Schema<PostDBType>({
  id: { type: String, require: true },
  title: { type: String, require: true },
  shortDescription: { type: String, required: true },
  content: { type: String, require: true },
  blogId: { type: String, require: true },
  blogName: { type: String, require: true },
  createdAt: { type: String, require: true },
});
export const PostModel = mongoose.model<PostDBType>("posts", PostSchema);

export const CommentLikesSchema = new mongoose.Schema<CommentLikesDBType>({
  id: { type: String, require: true },
  commentId: { type: String, require: true },
  createdAt: { type: Date, require: true },
  status: { type: String, default: "None", require: true },
  parentId: { type: String, require: true },
});
export const CommentLikesModel = mongoose.model<CommentLikesDBType>(
  "commentLikes",
  CommentLikesSchema
);

export const CommentSchema = new mongoose.Schema<CommentDBType>({
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
export const CommentModel = mongoose.model<CommentDBType>(
  "comments",
  CommentSchema
);

export const APIRequestsSchema = new mongoose.Schema<APIReqeustsType>({
  ip: { type: String, require: true },
  URL: { type: String, require: true },
  title: { type: String, require: true },
  date: { type: Date, require: true },
});
export const APIRequeststModel = mongoose.model<APIReqeustsType>(
  "api-requests",
  APIRequestsSchema
);

export const DevicesSchema = new mongoose.Schema<DeviceDBType>({
  deviceId: { type: String, require: true },
  ip: { type: String, require: true },
  lastActiveDate: { type: String, require: true },
  title: { type: String, require: true },
  userId: { type: String, require: true },
  expirationDate: { type: String, require: true },
});
export const DevicesModel = mongoose.model<DeviceDBType>(
  "security",
  DevicesSchema
);

export async function runDb() {
  try {
    await mongoose.connect(mongoURI);
    console.log("it is ok");
  } catch (e) {
    console.log("no connection");
    await mongoose.disconnect();
  }
}

console.log(mongoUri);
