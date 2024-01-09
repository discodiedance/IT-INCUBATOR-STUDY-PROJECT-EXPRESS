import { Router, Response } from "express";
import { UserService } from "../domain/user-service";
import { RequestWithBody } from "../types/common";
import { AuthMeType, InputLoginOrEmailType } from "../types/auth/input";
import { authValidation } from "../middlewares/auth/auth-validation";
import { authTokenMiddleware } from "../middlewares/auth/auth-token-middleware";
import { jwtService } from "../aplication/jwt-service";

export const authRoute = Router({});

authRoute.post(
  "/login",
  authValidation(),
  async (req: RequestWithBody<InputLoginOrEmailType>, res: Response) => {
    const user = await UserService.checkCredentials(
      req.body.loginOrEmail,
      req.body.password
    );

    if (user) {
      const token = await jwtService.createJWT(user._id.toString());
      return res.status(200).send(token);
    }
    return res.sendStatus(401);
  }
);

authRoute.get(
  "/me",
  authTokenMiddleware,
  authValidation(),
  async (req: RequestWithBody<AuthMeType>, res: Response) => {
    const user = req.user;
    if (!user) {
      return res.sendStatus(401);
    }
    return res.sendStatus(200);
  }
);
