import { NextFunction, Request, Response } from "express";
import { QueryUserRepository } from "../../repositories/query-repository/query-user-repository";

export const registrationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { login, email } = req.body;
  const userIsExistsByLogin = await QueryUserRepository.findyByLogin(login);

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

  const userIsExistsByEmail = await QueryUserRepository.findyByEmail(email);

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
