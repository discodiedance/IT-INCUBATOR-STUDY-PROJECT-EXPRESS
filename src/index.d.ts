import { BlogType } from "./types/blog/output";
import { UserType, OutputUserType } from "./types/user/output";

export {};

declare global {
  namespace Express {
    export interface Request {
      blog: BlogType | null;
    }
  }
  namespace Express {
    export interface Request {
      user: OutputUserType | null;
    }
  }
}
