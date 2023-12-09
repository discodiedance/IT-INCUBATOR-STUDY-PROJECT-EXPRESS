import { Request } from "express";
import { BlogType } from "./blog/output";

export type RequestWithParams<P> = Request<P, {}, {}, {}>;

export type RequestWithBody<B> = Request<{}, {}, B, {}>;

export type RequestWithBodyAndBlog<B> = Request<{}, {}, B, {}, BlogType>;

export type RequestWithBodyAndParams<P, B> = Request<P, {}, B, {}>;

export type RequestTypeWithQuery<Q> = Request<{}, {}, {}, Q>;

export type RequestTypeWithQueryBlogId<Q, P> = Request<P, {}, {}, Q>;

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

export type BlogIdParams = {
  blogId: string;
};
