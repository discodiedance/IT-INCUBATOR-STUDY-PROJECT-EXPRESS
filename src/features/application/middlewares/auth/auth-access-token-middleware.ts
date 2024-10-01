import { NextFunction, Request, Response } from "express";
import {
  jwtService,
  queryUserRepository,
} from "../../../../routes/composition-root";

export const authTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    res.sendStatus(401);
    return;
  }

  const accessToken = req.headers.authorization.split(" ")[1];

  const userId = await jwtService.getUserIdByJWTToken(accessToken);
  if (!userId) {
    res.sendStatus(401);
    return;
  }
  const foundedUser = await queryUserRepository.getMappedUserByUserId(userId);
  if (!foundedUser) {
    res.sendStatus(401);
    return;
  }
  req.user = foundedUser;
  return next();
};

export const authTokenForGetRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    req.user = null;
    return next();
  } else {
    const accessToken = req.headers.authorization.split(" ")[1];

    const userId = await jwtService.getUserIdByJWTToken(accessToken);
    if (!userId) {
      res.sendStatus(401);
      return;
    }
    const foundedUser = await queryUserRepository.getMappedUserByUserId(userId);
    if (!foundedUser) {
      res.sendStatus(401);
      return;
    }
    req.user = foundedUser;
  }
  return next();
};
