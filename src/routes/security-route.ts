import { Router } from "express";
import { securityController } from "./composition-root";
import { deviceMiddleware } from "../middlewares/security/device-login-middleware";
import { authRefreshTokenMiddleware } from "../middlewares/auth/auth-refresh-token-middleware";

export const securityRoute = Router({});

securityRoute.get(
  "/devices",
  authRefreshTokenMiddleware,
  deviceMiddleware,
  securityController.getallDevices.bind(securityController)
);

securityRoute.delete(
  "/devices",
  authRefreshTokenMiddleware,
  deviceMiddleware,
  securityController.terminateAllSessionsExcludeCurrent.bind(securityController)
);

securityRoute.delete(
  "/devices/:id",
  authRefreshTokenMiddleware,
  deviceMiddleware,
  securityController.terminateSessionById.bind(securityController)
);
