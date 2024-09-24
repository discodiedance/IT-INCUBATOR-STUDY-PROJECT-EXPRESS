import { Response, Request } from "express";
import { inject, injectable } from "inversify";
import { AuthService } from "../features/application/services/auth-service";
import { SecurityService } from "../features/application/services/security-service";
import { UserService } from "../features/application/services/user-service";
import { InputLoginOrEmailType } from "../types/auth/input";
import { RequestWithBody } from "../types/common";

import { JwtService } from "../features/application/services/jwt-service";
import { CreateUserAccountDataType } from "../types/user/user-dto";

@injectable()
export class AuthController {
  constructor(
    @inject(SecurityService) protected SecurityService: SecurityService,
    @inject(UserService) protected UserService: UserService,
    @inject(JwtService) protected JwtService: JwtService,
    @inject(AuthService) protected AuthService: AuthService
  ) {}

  async loginUser(req: RequestWithBody<InputLoginOrEmailType>, res: Response) {
    const user = await this.UserService.checkCredentials(
      req.body.loginOrEmail,
      req.body.password
    );

    if (!user) {
      res.sendStatus(401);
      return;
    }

    const ip = req.ip!.toString();
    const title = req.headers["user-agent"] as string;
    const userId = user.id;

    const tokens = await this.AuthService.loginUser(userId, ip, title);

    if (!tokens) {
      res.sendStatus(500);
      return;
    }

    const { accessToken, refreshToken } = tokens;

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
      })
      .status(200)
      .send({ accessToken });
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
    const status = await this.SecurityService.terminateDeviceByDeviceId(
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
    const user = req.user;
    if (!user) {
      res.sendStatus(401);
      return;
    }

    const userData = {
      email: user.email,
      login: user.login,
      id: user.id,
    };

    res.status(200).send(userData);
    return;
  }

  async confirmRegistration(req: Request, res: Response) {
    const result = await this.AuthService.confirmEmail(req.body.code);
    if (result.result === 204) {
      res.sendStatus(204);
      return;
    }

    if (result.result === 500) {
      res
        .status(500)
        .send({ errorsMessages: [{ message: result.message, field: "code" }] });
      return;
    }
    res
      .status(400)
      .send({ errorsMessages: [{ message: result.message, field: "code" }] });
    return;
  }

  async registrationUser(req: Request, res: Response) {
    const userData: CreateUserAccountDataType = {
      login: req.body.login,
      email: req.body.email,
      password: req.body.password,
    };

    const registrationResult =
      await this.AuthService.createUserByRegistration(userData);

    if (!registrationResult) {
      res.sendStatus(400);
      return;
    }
    res.sendStatus(204);
    return;
  }

  async registartionEmailResending(req: Request, res: Response) {
    const result = await this.AuthService.registartionEmailResending(
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
    const result =
      await this.AuthService.confirPasswordRecoveryCodeAndUpdatePassword(
        req.body.newPassword,
        req.body.recoveryCode
      );

    if (result.result === 204) {
      res.sendStatus(204);
      return;
    }

    res.status(400).send({
      errorsMessages: [{ message: result.message, field: "recoveryCode" }],
    });
    return;
  }
}
