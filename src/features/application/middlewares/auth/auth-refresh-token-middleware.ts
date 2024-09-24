import { NextFunction, Request, Response } from "express";
import {
  jwtService,
  queryUserRepository,
  securityRepository,
} from "../../../../routes/composition-root";

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

  const payLoad = await jwtService.validateRefreshToken(refreshToken);
  if (!payLoad) {
    res.sendStatus(401);
    return;
  }

  const { deviceId, userId, expirationDate } = payLoad;

  const DeviceSession = await securityRepository.getDeviceByDeviceId(deviceId);

  if (!DeviceSession) {
    res.sendStatus(401);
    return;
  }

  if (
    expirationDate !== DeviceSession.expirationDate &&
    userId !== DeviceSession.userId
  ) {
    res.sendStatus(401);
    return;
  }

  const userData = await queryUserRepository.getUserByUserId(userId);
  if (!userData) {
    res.sendStatus(401);
    return;
  }
  return next();
};
