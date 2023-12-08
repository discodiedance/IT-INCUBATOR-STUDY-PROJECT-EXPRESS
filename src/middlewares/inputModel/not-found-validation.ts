import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

const notFoundValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  //   .formatWith((error) => {
  //     switch (error.type) {
  //       case "field":
  //         return {
  //           message: error.msg,
  //           field: error.path,
  //         };
  //       default:
  //         return {
  //           message: error.msg,
  //           field: "not found",
  //         };
  //     }
  //   });

  if (!errors.isEmpty()) {
    // const err = errors.array({ onlyFirstError: true });

    return res.sendStatus(404);
  }
  return next();
};

export default notFoundValidation;
