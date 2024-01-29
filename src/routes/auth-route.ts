import { Router, Response, Request } from "express";
import { UserService } from "../domain/user-service";
import { RequestWithBody } from "../types/common";
import { InputLoginOrEmailType } from "../types/auth/input";
import { authValidation } from "../middlewares/auth/auth-validation";
import { authTokenMiddleware } from "../middlewares/auth/auth-token-middleware";
import { jwtService } from "../aplication/jwt-service";
import { authService } from "../domain/auth-service";
<<<<<<< HEAD
=======
import { UserRepostitory } from "../repositories/user-repository";
>>>>>>> a1a9fe719e0e78ae31822c7ab8155defc0236737

export const authRoute = Router({});

authRoute.post("/registration", async (req: Request, res: Response) => {
  const userData = {
    login: req.body.login,
    email: req.body.email,
    password: req.body.password,
  };

  const registrationResult = await authService.createUserByRegistration(
    userData
  );

  if (registrationResult) {
    res.status(204).send();
  } else {
    res.status(400).send({});
  }
});

authRoute.post(
  "/registration-confirmation",
  async (req: Request, res: Response) => {
    const result = await authService.confirmEmail(req.body.code);
    if (result) {
      res.status(201).send();
    } else {
      res.status(400).send({});
    }
  }
);

authRoute.post(
  "/registration-confirmation-email-resending",
  async (req: Request, res: Response) => {
    const resendedCode = await authService.resendEmail(req.body.email);
    if (resendedCode) {
      res.status(204).send();
    } else {
      res.status(400).send({});
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
