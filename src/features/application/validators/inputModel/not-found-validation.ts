import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const notFoundValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.sendStatus(404);
    return;
  }
  return next();
};
