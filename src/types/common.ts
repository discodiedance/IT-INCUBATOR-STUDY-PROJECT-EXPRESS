import { Request } from "express";
import { BlogType } from "../types/blog/output";
import { PostType } from "../types/post/output";
import { VideoType } from "../types/video/output";

export type RequestWithParams<P> = Request<P, {}, {}, {}>;

export type RequestWithBody<B> = Request<{}, {}, B, {}>;

export type RequestWithBodyAndParams<P, B> = Request<P, {}, B, {}>;

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

export type DBType = {
  videos: VideoType[];
  blogs: BlogType[];
  posts: PostType[];
};
