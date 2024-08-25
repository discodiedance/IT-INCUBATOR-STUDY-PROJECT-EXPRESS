import { NextFunction, Request, Response } from "express";
import { jwtService } from "../../aplication/jwt-service";
import { QueryUserRepository } from "../../repositories/query-repository/query-user-repository";
import { OutputUserType } from "../../types/user/output";

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
  const foundedUser: OutputUserType | null =
    await QueryUserRepository.getUserById(userId);
  if (!foundedUser) {
    res.sendStatus(401);
    return;
  }
  req.user = foundedUser;
  next();
};
