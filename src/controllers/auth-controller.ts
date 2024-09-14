import { Response, Request } from "express";

import { JwtService } from "../aplication/jwt-service";
import { AuthService } from "../domain/auth-service";
import { SecurityService } from "../domain/security-service";
import { UserService } from "../domain/user-service";

import { InputLoginOrEmailType } from "../types/auth/input";
import {
  RequestWithBody,
  ConfirmEmailType,
  ResendEmailType,
} from "../types/common";
import { UserDBType, OutputUserType } from "../types/user/output";

export class AuthController {
  constructor(
    protected SecurityService: SecurityService,
    protected UserService: UserService,
    protected JwtService: JwtService,
    protected AuthService: AuthService
  ) {}

  async loginUser(req: RequestWithBody<InputLoginOrEmailType>, res: Response) {
    const user: UserDBType | null = await this.UserService.checkCredentials(
      req.body.loginOrEmail,
      req.body.password
    );

    if (user) {
      const ip: string = req.ip!.toString();
      const title: string = req.headers["user-agent"] as string;
      const userId: string = user.id;

      const tokens = await this.AuthService.loginUser(userId, ip, title);

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
  async updateRefreshToken(req: Request, res: Response) {
    const userId = await this.JwtService.getUserIdByRefreshToken(
      req.cookies.refreshToken
    );
    const deviceId = await this.JwtService.getDeviceIdByRefreshToken(
      req.cookies.refreshToken
    );

    const updatedTokens = await this.AuthService.updateRefreshTokens(
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
  async logoutUser(req: Request, res: Response) {
    const deviceId = await this.JwtService.getDeviceIdByRefreshToken(
      req.cookies.refreshToken
    );
    if (!deviceId) {
      res.sendStatus(401);
      return;
    }
    const status: boolean | null =
      await this.SecurityService.terminateDeviceByDeviceId(
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
  async getInfoAboutCurrentUser(req: Request, res: Response) {
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
  async confirmRegistration(req: Request, res: Response) {
    const result: ConfirmEmailType = await this.AuthService.confirmEmail(
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
  async registrationUser(req: Request, res: Response) {
    const userData = {
      login: req.body.login,
      email: req.body.email,
      password: req.body.password,
    };
    const registrationResult: OutputUserType | null =
      await this.AuthService.createUserByRegistration(userData);

    if (!registrationResult) {
      res.sendStatus(400);
      return;
    } else {
      res.sendStatus(204);
      return;
    }
  }
  async registartionEmailResending(req: Request, res: Response) {
    const result: ResendEmailType = await this.AuthService.resendEmail(
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
  async passwordRecovery(req: Request, res: Response) {
    await this.AuthService.sendPasswordRecoveryCode(req.body.email);
    res.sendStatus(204);
    return;
  }
  async updateNewPassword(req: Request, res: Response) {
    const result: ResendEmailType =
      await this.AuthService.confirPasswordRecoveryCodeAndUpdatePassword(
        req.body.newPassword,
        req.body.recoveryCode
      );
    if (result.result === 204) {
      res.sendStatus(204);
      return;
    } else {
      res.status(400).send({
        errorsMessages: [{ message: result.message, field: "recoveryCode" }],
      });
      return;
    }
  }
}
