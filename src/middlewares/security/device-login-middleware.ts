import { NextFunction, Request, Response } from "express";
import {
  jwtService,
  querySecurityRepostiory,
} from "../../routes/composition-root";
import { DeviceDBType } from "../../types/security/input";

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

  const anyDevice: DeviceDBType | null =
    await querySecurityRepostiory.getDeviceByDeviceId(currentDeviceId);
  if (!anyDevice) {
    res.sendStatus(401);
  }

  return next();
};
