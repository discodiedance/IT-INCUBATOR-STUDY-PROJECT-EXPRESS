import { NextFunction, Request, Response } from "express";
import {
  jwtService,
  querySecurityRepostiory,
  queryUserRepository,
} from "../../routes/composition-root";
import { DeviceDBType } from "../../types/security/input";
import { OutputUserType } from "../../types/user/output";

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

  const { deviceId, userId, exp } = payLoad;

  const DeviceSession: DeviceDBType | null =
    await querySecurityRepostiory.getDeviceByDeviceId(deviceId);
  if (!DeviceSession) {
    res.sendStatus(401);
    return;
  }

  if (exp !== DeviceSession.expirationDate && userId !== DeviceSession.userId) {
    res.sendStatus(401);
    return;
  }

  const userData: OutputUserType | null =
    await queryUserRepository.getUserById(userId);
  if (!userData) {
    res.sendStatus(401);
    return;
  }

  next();
};
