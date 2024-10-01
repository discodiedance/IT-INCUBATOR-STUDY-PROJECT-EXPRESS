import { Router, Request, Response } from "express";
import { APIRequeststModel } from "../features/domain/entities/api-requests-entity";
import { BlogModel } from "../features/domain/entities/blog-entity";
import { CommentLikesModel } from "../features/domain/entities/commen-likes-entity";
import { CommentModel } from "../features/domain/entities/comment-enitity";
import { PostModel } from "../features/domain/entities/post-entity";
import { DevicesModel } from "../features/domain/entities/security-entity";
import { UserModel } from "../features/domain/entities/user-entity";
import { PostLikesModel } from "../features/domain/entities/post-likes-entity";

export const testingRoute = Router({});

testingRoute.delete("/all-data", async (req: Request, res: Response) => {
  await BlogModel.deleteMany({});
  await PostModel.deleteMany({});
  await PostLikesModel.deleteMany({});
  await UserModel.deleteMany({});
  await CommentModel.deleteMany({});
  await CommentLikesModel.deleteMany({});
  await DevicesModel.deleteMany({});
  await APIRequeststModel.deleteMany({});
  res.sendStatus(204);
});
