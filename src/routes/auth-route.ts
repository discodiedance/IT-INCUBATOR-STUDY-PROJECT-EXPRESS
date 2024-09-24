import { Router } from "express";
import { authController } from "./composition-root";
import { authTokenMiddleware } from "../features/application/middlewares/auth/auth-access-token-middleware";
import { authRefreshTokenMiddleware } from "../features/application/middlewares/auth/auth-refresh-token-middleware";
import { registrationMiddleware } from "../features/application/middlewares/auth/registration-middleware";
import { customRateLimitiMiddleware } from "../features/application/middlewares/security/ip-url-date-middleware";
import { authValidation } from "../features/application/validators/auth/auth-validation";
import {
  userCodeValidation,
  userValidation,
  userEmailValidation,
  userPasswordUpdateValidation,
} from "../features/application/validators/user/user-validation";

export const authRoute = Router({});

authRoute.post(
  "/login",
  customRateLimitiMiddleware,
  authValidation(),
  authController.loginUser.bind(authController)
);

authRoute.post(
  "/refresh-token",
  authRefreshTokenMiddleware,
  authController.updateRefreshToken.bind(authController)
);

authRoute.post(
  "/logout",
  authRefreshTokenMiddleware,
  authController.logoutUser.bind(authController)
);

authRoute.get(
  "/me",
  authTokenMiddleware,
  authController.getInfoAboutCurrentUser.bind(authController)
);

authRoute.post(
  "/registration-confirmation",
  customRateLimitiMiddleware,
  userCodeValidation(),
  authController.confirmRegistration.bind(authController)
);

authRoute.post(
  "/registration",
  customRateLimitiMiddleware,
  registrationMiddleware,
  userValidation(),
  authController.registrationUser.bind(authController)
);
authController;

authRoute.post(
  "/registration-email-resending",
  customRateLimitiMiddleware,
  userEmailValidation(),
  authController.registartionEmailResending.bind(authController)
);

authRoute.post(
  "/password-recovery",
  customRateLimitiMiddleware,
  userEmailValidation(),
  authController.passwordRecovery.bind(authController)
);

authRoute.post(
  "/new-password",
  customRateLimitiMiddleware,
  userPasswordUpdateValidation(),
  authController.updateNewPassword.bind(authController)
);
