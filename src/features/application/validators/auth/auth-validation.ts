import { body } from "express-validator";
import { inputModelValidation } from "../inputModel/input-model-validation";

export const loginOrEmailValidation = body("loginOrEmail")
  .isString()
  .trim()
  .isLength({ min: 3, max: 50 })
  .withMessage("Incorrect value");

export const passwordValidation = body("password")
  .isString()
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage("Incorrect value");

export const authValidation = () => [
  loginOrEmailValidation,
  passwordValidation,
  inputModelValidation,
];
