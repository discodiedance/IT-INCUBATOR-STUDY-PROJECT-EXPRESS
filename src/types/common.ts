import { Request } from "express";
import { OutputBlogType } from "./blog/output";

export type RequestWithParams<P> = Request<P, {}, {}, {}>;

export type RequestWithBody<B> = Request<{}, {}, B, {}>;

export type RequestWithBodyAndBlog<B> = Request<{}, {}, B, {}, OutputBlogType>;

export type RequestWithBodyAndParams<P, B> = Request<P, {}, B, {}>;

export type RequestWithCommentBodyAndParams<P, B> = Request<P, {}, B, {}>;

export type RequestTypeWithQuery<Q> = Request<{}, {}, {}, Q>;

export type RequestTypeWithQueryBlogId<Q, P> = Request<P, {}, {}, Q>;

export type RequestTypeWithQueryPostId<Q, P> = Request<P, {}, {}, Q>;

export type ErrorType = {
  errorsMessages: ErorMessageType[];
};

export type ErorMessageType = {
  field: string;
  message: string;
};

export type Params = {
  id: string;
};

export type DeviceIdParams = {
  id: string;
};

export type BlogIdParams = {
  blogId: string;
};

export type PostIdParams = {
  postId: string;
};

export type UserIdParams = {
  id: any;
  userId: string;
};

export type APIReqeustsType = {
  ip: string;
  URL: string;
  title: string;
  date: Date;
};

export type ConfirmEmailType = {
  result: number;
  message: string;
};

export type ResendEmailType = {
  result: number;
  message: string;
};
