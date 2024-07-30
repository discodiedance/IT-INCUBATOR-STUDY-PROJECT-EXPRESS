import { Router, Response, Request } from "express";
import { UserService } from "../domain/user-service";
import { RequestWithBody } from "../types/common";
import { InputLoginOrEmailType } from "../types/auth/input";
import { authValidation } from "../middlewares/auth/auth-validation";
import { authTokenMiddleware } from "../middlewares/auth/auth-token-middleware";
import { AuthService } from "../domain/auth-service";
import {
  userCodeValidation,
  userEmailValidation,
  userValidation,
} from "../middlewares/user/user-validation";
import { registrationMiddleware } from "../middlewares/auth/registration-middleware";
import { authRefreshTokenMiddleware } from "../middlewares/auth/auth-refresh-token-middleware";
import { customRateLimitiMiddleware } from "../middlewares/security/ip-url-date-middleware";
import { jwtService } from "../aplication/jwt-service";
import { SecurityService } from "../domain/security-service";

export const authRoute = Router({});

authRoute.post(
  "/login",
  customRateLimitiMiddleware,
  authValidation(),
  async (req: RequestWithBody<InputLoginOrEmailType>, res: Response) => {
    const user = await UserService.checkCredentials(
      req.body.loginOrEmail,
      req.body.password
    );

    if (user) {
      const ip = req.ip!.toString();
      const title = req.headers["user-agent"] as string;

      const tokens = await AuthService.loginUser(
        user._id.toString(),
        ip,
        title
      );

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

    const tokens = await AuthService.refreshTokens(deviceId, userId);
    if (!tokens) {
      res.sendStatus(500);
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
);

authRoute.post(
  "/logout",
  authRefreshTokenMiddleware,
  async (req: Request, res: Response) => {
    const userId = await jwtService.getUserIdByRefreshToken(
      req.cookies.refreshToken
    );
    const deviceId = await jwtService.getDeviceIdByRefreshToken(
      req.cookies.refreshToken
    );
    const result = await SecurityService.terminateDeviceByDeviceId(
      userId,
      deviceId
    );
    if (!result) {
      return false;
    }
    res.sendStatus(204);
    return;
  }
);

authRoute.get(
  "/me",
  authTokenMiddleware,
  async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
      res.sendStatus(401);
      return;
    }
    const userData = {
      email: user.email,
      login: user.login,
      userId: user.id,
    };
    return res.status(200).send(userData);
  }
);

authRoute.post(
  "/registration-confirmation",
  customRateLimitiMiddleware,
  userCodeValidation(),
  async (req: Request, res: Response) => {
    const result = await AuthService.confirmEmail(req.body.code);
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
    const registrationResult = await AuthService.createUserByRegistration(
      userData
    );

    if (registrationResult) {
      return res.sendStatus(204);
    } else {
      res.sendStatus(400);
      return;
    }
  }
);

authRoute.post(
  "/registration-email-resending",
  customRateLimitiMiddleware,
  userEmailValidation(),
  async (req: Request, res: Response) => {
    const result = await AuthService.resendEmail(req.body.email);
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
