import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

const notFoundValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.sendStatus(404);
  }
  return next();
};

export default notFoundValidation;
