import { NextFunction, Request, Response } from "express";
import { queryUserRepository } from "../../../../routes/composition-root";

export const registrationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { login, email } = req.body;

  const userIsExistsByLogin =
    await queryUserRepository.getMappedUserByLogin(login);

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

  const userIsExistsByEmail =
    await queryUserRepository.getMappedUserByEmail(email);

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
