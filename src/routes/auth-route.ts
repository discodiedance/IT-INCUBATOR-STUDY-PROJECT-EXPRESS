import { Router, Response, Request } from "express";
import { UserService } from "../domain/user-service";
import {
  ConfirmEmailType,
  RequestWithBody,
  ResendEmailType,
} from "../types/common";
import { InputLoginOrEmailType } from "../types/auth/input";
import { authValidation } from "../middlewares/auth/auth-validation";
import { authTokenMiddleware } from "../middlewares/auth/auth-access-token-middleware";
import { AuthService } from "../domain/auth-service";
import {
  userCodeValidation,
  userEmailValidation,
  userPasswordUpdateValidation,
  userValidation,
} from "../middlewares/user/user-validation";
import { registrationMiddleware } from "../middlewares/auth/registration-middleware";
import { authRefreshTokenMiddleware } from "../middlewares/auth/auth-refresh-token-middleware";
import { customRateLimitiMiddleware } from "../middlewares/security/ip-url-date-middleware";
import { jwtService } from "../aplication/jwt-service";
import { SecurityService } from "../domain/security-service";
import { OutputUserType, UserDBType } from "../types/user/output";

export const authRoute = Router({});

authRoute.post(
  "/login",
  customRateLimitiMiddleware,
  authValidation(),
  async (req: RequestWithBody<InputLoginOrEmailType>, res: Response) => {
    const user: UserDBType | null = await UserService.checkCredentials(
      req.body.loginOrEmail,
      req.body.password
    );

    if (user) {
      const ip: string = req.ip!.toString();
      const title: string = req.headers["user-agent"] as string;
      const userId: string = user.id;

      const tokens = await AuthService.loginUser(userId, ip, title);

      if (!tokens) {
        res.sendStatus(401);
        return;
      }

      const { accessToken, refreshToken } = tokens;

      return res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
        })
        .status(200)
        .send({ accessToken });
    }
    res.sendStatus(401);
    return;
  }
);

authRoute.post(
  "/refresh-token",
  authRefreshTokenMiddleware,
  async (req: Request, res: Response) => {
    const userId = await jwtService.getUserIdByRefreshToken(
      req.cookies.refreshToken
    );
    const deviceId = await jwtService.getDeviceIdByRefreshToken(
      req.cookies.refreshToken
    );

    const updatedTokens = await AuthService.updateRefreshTokens(
      deviceId,
      userId
    );
    if (!updatedTokens) {
      res.sendStatus(500);
      return;
    }

    const { accessToken, refreshToken } = updatedTokens;

    return res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
      })
      .status(200)
      .send({ accessToken });
  }
);

authRoute.post(
  "/logout",
  authRefreshTokenMiddleware,
  async (req: Request, res: Response) => {
    const deviceId = await jwtService.getDeviceIdByRefreshToken(
      req.cookies.refreshToken
    );
    if (!deviceId) {
      res.sendStatus(401);
      return;
    }
    const status: boolean | null =
      await SecurityService.terminateDeviceByDeviceId(
        deviceId,
        req.cookies.refreshToken
      );
    if (!status) {
      res.sendStatus(401);
      return;
    }
    res.sendStatus(204);
    return;
  }
);

authRoute.get(
  "/me",
  authTokenMiddleware,
  async (req: Request, res: Response) => {
    const user: OutputUserType | null = req.user;
    if (!user) {
      res.sendStatus(401);
      return;
    }
    const userData = {
      email: user.email,
      login: user.login,
      id: user.id,
    };
    return res.status(200).send(userData);
  }
);

authRoute.post(
  "/registration-confirmation",
  customRateLimitiMiddleware,
  userCodeValidation(),
  async (req: Request, res: Response) => {
    const result: ConfirmEmailType = await AuthService.confirmEmail(
      req.body.code
    );
    if (result.result === 204) {
      res.sendStatus(204);
      return;
    } else {
      return res
        .status(400)
        .send({ errorsMessages: [{ message: result.message, field: "code" }] });
    }
  }
);

authRoute.post(
  "/registration",
  customRateLimitiMiddleware,
  registrationMiddleware,
  userValidation(),
  async (req: Request, res: Response) => {
    const userData = {
      login: req.body.login,
      email: req.body.email,
      password: req.body.password,
    };
    const registrationResult: OutputUserType | null =
      await AuthService.createUserByRegistration(userData);

    if (!registrationResult) {
      res.sendStatus(400);
      return;
    } else {
      res.sendStatus(204);
      return;
    }
  }
);

authRoute.post(
  "/registration-email-resending",
  customRateLimitiMiddleware,
  userEmailValidation(),
  async (req: Request, res: Response) => {
    const result: ResendEmailType = await AuthService.resendEmail(
      req.body.email
    );
    if (result.result === 204) {
      res.sendStatus(204);
      return;
    } else {
      return res.status(400).send({
        errorsMessages: [{ message: result.message, field: "email" }],
      });
    }
  }
);

authRoute.post(
  "/password-recovery",
  customRateLimitiMiddleware,
  userEmailValidation(),
  async (req: Request, res: Response) => {
    await AuthService.sendPasswordRecoveryCode(req.body.email);
    res.sendStatus(204);
    return;
  }
);

authRoute.post(
  "/new-password",
  customRateLimitiMiddleware,
  userPasswordUpdateValidation(),
  async (req: Request, res: Response) => {
    const result: ResendEmailType =
      await AuthService.confirPasswordRecoveryCodeAndUpdatePassword(
        req.body.newPassword,
        req.body.recoveryCode
      );
    if (result.result === 204) {
      res.sendStatus(204);
      return;
    } else {
      res
        .status(400)
        .send({
          errorsMessages: [{ message: result.message, field: "recoveryCode" }],
        });
      return;
    }
  }
);
