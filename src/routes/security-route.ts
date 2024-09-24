import { Router } from "express";
import { securityController } from "./composition-root";
import { authRefreshTokenMiddleware } from "../features/application/middlewares/auth/auth-refresh-token-middleware";
import { deviceMiddleware } from "../features/application/middlewares/security/device-login-middleware";

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
