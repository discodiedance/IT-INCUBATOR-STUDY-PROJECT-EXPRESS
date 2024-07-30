import { NextFunction, Request, Response } from "express";
import { jwtService } from "../../aplication/jwt-service";
import { QueryUserRepository } from "../../repositories/query-repository/query-user-repository";
import { SecurityQueryRepostiory } from "../../repositories/query-repository/query-security-repository";

export const authRefreshTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies["refreshToken"];

  if (!refreshToken) {
    res.sendStatus(401);
    return;
  }

  const payLoad: any = await jwtService.validateRefreshToken(refreshToken);

  if (!payLoad) {
    res.sendStatus(401);
    return;
  }

  const { deviceId, userId, exp } = payLoad;

  const DeviceSession = await SecurityQueryRepostiory.getDeviceByDeviceId(
    deviceId
  );

  if (!DeviceSession) {
    res.sendStatus(401);
    return;
  }

  if (exp !== DeviceSession.expirationDate || userId !== DeviceSession.userId) {
    res.sendStatus(401);
    return;
  }

  const userData = await QueryUserRepository.getUserById(userId);
  if (!userData) {
    res.sendStatus(401);
    return;
  }

  next();
};
