import { NextFunction, Request, Response } from "express";
import { apiRequestsCollection } from "../../db/db";

export const customRateLimitiMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const IP = req.ip || "incorrect";
  const URL = req.originalUrl;
  const date = new Date();
  const filter = { IP, URL, date };

  await apiRequestsCollection.insertOne(filter);

  const reducedDate = new Date(Date.now() - 10000);

  const totalCount = await apiRequestsCollection.countDocuments({
    URL: URL,
    IP: IP,
    date: { $gte: reducedDate },
  });

  if (totalCount > 5) {
    res.sendStatus(429);
    return;
  }
  return next();
};
