import { Router, Request, Response } from "express";
import {
  APIRequeststModel,
  BlogModel,
  CommentLikesModel,
  CommentModel,
  DevicesModel,
  PostModel,
  UserModel,
} from "../db/db";

export const testingRoute = Router({});

testingRoute.delete("/all-data", async (req: Request, res: Response) => {
  await BlogModel.deleteMany({});
  await PostModel.deleteMany({});
  await UserModel.deleteMany({});
  await CommentModel.deleteMany({});
  await CommentLikesModel.deleteMany({});
  await DevicesModel.deleteMany({});
  await APIRequeststModel.deleteMany({});
  res.sendStatus(204);
});
