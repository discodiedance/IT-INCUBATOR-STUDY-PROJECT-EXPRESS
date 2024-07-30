import { Router, Response, Request } from "express";
import { SecurityRepostiory } from "../repositories/security-repository";
import { SecurityQueryRepostiory } from "../repositories/query-repository/query-security-repository";
import { deviceMiddleware } from "../middlewares/security/device-login-middleware";
import { DeviceIdParams, Params, RequestWithParams } from "../types/common";
import { authRefreshTokenMiddleware } from "../middlewares/auth/auth-refresh-token-middleware";
import { jwtService } from "../aplication/jwt-service";
import { SecurityService } from "../domain/security-service";

export const securityRoute = Router({});

securityRoute.get(
  "/devices",
  authRefreshTokenMiddleware,
  deviceMiddleware,
  async (req: Request, res: Response) => {
    const userId = await jwtService.getUserIdByRefreshToken(
      req.cookies.refreshToken
    );
    const devices = await SecurityQueryRepostiory.getAllDevicesByUserId(userId);
    return res.status(200).send(devices);
  }
);

securityRoute.delete(
  "/devices",
  authRefreshTokenMiddleware,
  deviceMiddleware,
  async (req: Request, res: Response) => {
    const userId = await jwtService.getUserIdByRefreshToken(
      req.cookies.refreshToken
    );
    const deviceId = await jwtService.getDeviceIdByRefreshToken(
      req.cookies.refreshToken
    );
    const status =
      await SecurityRepostiory.terminateAllDevicesByUserIdExcludeCurrent(
        userId,
        deviceId
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
    const deviceId = req.params.id;

    const device = await SecurityQueryRepostiory.getDeviceByDeviceId(deviceId);

    if (!device) {
      res.sendStatus(404);
      return;
    }

    const currentUserId = await jwtService.getUserIdByRefreshToken(
      req.cookies.refreshToken
    );

    const status = await SecurityService.terminateDeviceByDeviceId(
      currentUserId,
      deviceId
    );

    if (!status) {
      res.sendStatus(403);
      return;
    }

    return res.sendStatus(204);
  }
);
