import { Request } from "express";
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
