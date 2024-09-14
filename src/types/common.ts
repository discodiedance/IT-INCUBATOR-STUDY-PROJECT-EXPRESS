import { Request } from "express";

export type RequestWithParams<P> = Request<P, {}, {}, {}>;

export type RequestWithBody<B> = Request<{}, {}, B, {}>;

export type RequestWithBodyAndParams<P, B> = Request<P, {}, B, {}>;

export type RequestTypeWithQuery<Q> = Request<{}, {}, {}, Q>;

export type RequestTypeWithQueryBlogId<Q, P> = Request<P, {}, {}, Q>;

export type RequestTypeWithQueryPostId<Q, P> = Request<P, {}, {}, Q>;

export class ErrorType {
  constructor(public errorsMessages: ErorMessageType[]) {}
}
export class ErorMessageType {
  constructor(
    public field: string,
    public message: string
  ) {}
}

export type Params = {
  id: string;
};

export type BlogIdParams = {
  blogId: string;
};

export type PostIdParams = {
  postId: string;
};

export type CommentIdParams = {
  commentId: string;
};

export class APIReqeustsType {
  constructor(
    public ip: string,
    public URL: string,
    public title: string,
    public date: Date
  ) {}
}

export class ConfirmEmailType {
  constructor(
    public result: number,
    public message: string
  ) {}
}
export class ResendEmailType {
  constructor(
    public result: number,
    public message: string
  ) {}
}
