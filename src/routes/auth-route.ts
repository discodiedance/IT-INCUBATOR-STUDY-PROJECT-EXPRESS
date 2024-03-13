import { Router, Response, Request } from "express";
import { UserService } from "../domain/user-service";
import { RequestWithBody } from "../types/common";
import { InputLoginOrEmailType } from "../types/auth/input";
import { authValidation } from "../middlewares/auth/auth-validation";
import { authTokenMiddleware } from "../middlewares/auth/auth-token-middleware";
import { jwtService } from "../aplication/jwt-service";
import { authService } from "../domain/auth-service";
import {
  userCodeValidation,
  userEmailValidation,
  userValidation,
} from "../middlewares/user/user-validation";
import { registrationMiddleware } from "../middlewares/auth/registration-middleware";

export const authRoute = Router({});

authRoute.post(
  "/registration",
  registrationMiddleware,
  userValidation(),
  async (req: Request, res: Response) => {
    const userData = {
      login: req.body.login,
      email: req.body.email,
      password: req.body.password,
    };
    const registrationResult = await authService.createUserByRegistration(
      userData
    );

    if (registrationResult) {
      return res.sendStatus(204);
    } else {
      return res.sendStatus(400);
    }
  }
);

authRoute.post(
  "/registration-confirmation",
  userCodeValidation(),
  async (req: Request, res: Response) => {
    const result = await authService.confirmEmail(req.body.code);
    if (result.result === 204) {
      return res.sendStatus(204);
    } else {
      return res
        .status(400)
        .send({ errorsMessages: [{ message: result.message, field: "code" }] });
    }
  }
);

authRoute.post(
  "/registration-email-resending",
  userEmailValidation(),
  async (req: Request, res: Response) => {
    const result = await authService.resendEmail(req.body.email);
    if (result.result === 204) {
      res.sendStatus(204);
    } else {
      res.status(400).send({
        errorsMessages: [{ message: result.message, field: "email" }],
      });
    }
  }
);

authRoute.post(
  "/login",
  authValidation(),
  async (req: RequestWithBody<InputLoginOrEmailType>, res: Response) => {
    const user = await UserService.checkCredentials(
      req.body.loginOrEmail,
      req.body.password
    );

    if (user) {
      const accessToken = await jwtService.createJWT(user._id.toString());
      return res.status(200).send({ accessToken });
    }
    return res.sendStatus(401);
  }
);

authRoute.get(
  "/me",
  authTokenMiddleware,
  async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
      return res.sendStatus(401);
    }
    const userData = {
      email: user.email,
      login: user.login,
      userId: user.id,
    };
    return res.status(200).send(userData);
  }
);
