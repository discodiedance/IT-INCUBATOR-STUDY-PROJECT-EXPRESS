import { BlogType } from "./types/blog/output";

export {};

declare global {
  namespace Express {
    export interface Request {
      blog: BlogType | null;
    }
  }
}
