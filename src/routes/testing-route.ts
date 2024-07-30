import { Router, Request, Response } from "express";
import {
  apiRequestsCollection,
  blogCollection,
  commentCollection,
  deviceAuthSessionsCollection,
  postCollection,
  userCollection,
} from "../db/db";

export const testingRoute = Router({});

testingRoute.delete("/all-data", async (req: Request, res: Response) => {
  await blogCollection.deleteMany({});
  await postCollection.deleteMany({});
  await userCollection.deleteMany({});
  await commentCollection.deleteMany({});
  await deviceAuthSessionsCollection.deleteMany({});
  await apiRequestsCollection.deleteMany({});
  res.sendStatus(204);
});
