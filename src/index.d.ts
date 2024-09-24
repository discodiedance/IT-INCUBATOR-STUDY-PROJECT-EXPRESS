import { OutputBlogType } from "./types/blog/output";
import { OutputUserType } from "./types/user/output";

export {};

declare global {
  namespace Express {
    export interface Request {
      blog: OutputBlogType | null;
    }
  }
  namespace Express {
    export interface Request {
      user: OutputUserType | null;
    }
  }
}
