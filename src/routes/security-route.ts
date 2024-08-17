import { Router, Response, Request } from "express";
import { SecurityQueryRepostiory } from "../repositories/query-repository/query-security-repository";
import { deviceMiddleware } from "../middlewares/security/device-login-middleware";
import { DeviceIdParams, RequestWithParams } from "../types/common";
import { authRefreshTokenMiddleware } from "../middlewares/auth/auth-refresh-token-middleware";
import { jwtService } from "../aplication/jwt-service";
import { SecurityService } from "../domain/security-service";
import { DeviceDBType } from "../types/security/input";
import { OutputDeviceType } from "../types/security/output";

export const securityRoute = Router({});

securityRoute.get(
  "/devices",
  authRefreshTokenMiddleware,
  deviceMiddleware,
  async (req: Request, res: Response) => {
    const userId: string = await jwtService.getUserIdByRefreshToken(
      req.cookies.refreshToken
    );
    const devices: OutputDeviceType[] | null =
      await SecurityQueryRepostiory.getAllDevicesByUserId(userId);
    return res.status(200).send(devices);
  }
);

securityRoute.delete(
  "/devices",
  authRefreshTokenMiddleware,
  deviceMiddleware,
  async (req: Request, res: Response) => {
    const status: boolean | null =
      await SecurityService.terminateAllDevicesByUserIdExcludeCurrent(
        req.cookies.refreshToken
      );

    if (!status) {
      res.sendStatus(401);
      return;
    }
    return res.sendStatus(204);
  }
);

securityRoute.delete(
  "/devices/:id",
  authRefreshTokenMiddleware,
  deviceMiddleware,
  async (req: RequestWithParams<DeviceIdParams>, res: Response) => {
    const device: DeviceDBType | null =
      await SecurityQueryRepostiory.getDeviceByDeviceId(req.params.id);

    if (!device) {
      res.sendStatus(404);
      return;
    }
    const status: boolean | null =
      await SecurityService.terminateDeviceByDeviceId(
        device.deviceId,
        req.cookies.refreshToken
      );

    if (!status) {
      res.sendStatus(403);
      return;
    }

    return res.sendStatus(204);
  }
);
