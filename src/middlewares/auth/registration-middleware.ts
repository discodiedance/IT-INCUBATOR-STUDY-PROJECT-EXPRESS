import { NextFunction, Request, Response } from "express";
import { UserRepostitory } from "../../repositories/user-repository";

export const registrationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { login, email } = req.body;
  const userIsExistsByLogin = await UserRepostitory.findyByLogin(login);
  if (userIsExistsByLogin) {
    res.status(400).send({
      errorsMessages: [
        {
          message: "Already exists",
          field: "login",
        },
      ],
    });

    return;
  }

  const userIsExistsByEmail = await UserRepostitory.findyByEmail(email);

  if (userIsExistsByEmail) {
    res.status(400).send({
      errorsMessages: [
        {
          message: "Already exists",
          field: "email",
        },
      ],
    });
    return;
  }

  return next();
};
