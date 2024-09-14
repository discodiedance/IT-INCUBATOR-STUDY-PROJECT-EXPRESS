import { NextFunction, Request, Response } from "express";
import { APIRequeststModel } from "../../db/db";

export const customRateLimitiMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = req.ip || "incorrect";
  const URL = req.originalUrl;
  const title = req.headers["user-agent"] || "incorrect";
  const date = new Date();

  const filter = { ip, URL, title, date };

  await APIRequeststModel.create(filter);

  const reducedDate = new Date(Date.now() - 10000);

  const totalCount = await APIRequeststModel.countDocuments({
    ip: ip,
    URL: URL,
    title: title,
    date: { $gte: reducedDate },
  });

  if (totalCount > 5) {
    res.sendStatus(429);
    return;
  }
  return next();
};
