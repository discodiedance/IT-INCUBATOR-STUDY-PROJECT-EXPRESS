import { NextFunction, Request, Response } from "express";
import { SecurityQueryRepostiory } from "../../repositories/query-repository/query-security-repository";
import { jwtService } from "./../../aplication/jwt-service";

export const deviceMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentDeviceId = await jwtService.getDeviceIdByRefreshToken(
    req.cookies["refreshToken"]
  );

  if (!currentDeviceId) {
    res.sendStatus(401);
    return;
  }

  const anyDevice = await SecurityQueryRepostiory.getDeviceByDeviceId(
    currentDeviceId
  );

  if (!anyDevice) {
    res.sendStatus(401);
  }

  return next();
};
