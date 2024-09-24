import { NextFunction, Request, Response } from "express";
import {
  jwtService,
  securityRepository,
} from "../../../../routes/composition-root";

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

  const anyDevice =
    await securityRepository.getDeviceByDeviceId(currentDeviceId);

  if (!anyDevice) {
    res.sendStatus(401);
    return;
  }

  return next();
};
