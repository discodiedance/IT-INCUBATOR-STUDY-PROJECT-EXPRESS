import { body } from "express-validator";
import { inputModelValidation } from "../inputModel/input-model-validation";

export const loginValidation = body("login")
  .isString()
  .trim()
  .isLength({ min: 3, max: 10 })
  .withMessage("Incorrect value")
  .matches("^[a-zA-Z0-9_-]*$")
  .withMessage("Incorrect value");

export const passwordValidation = body("password")
  .isString()
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage("Incorrect value");

export const emailValidation = body("email")
  .isString()
  .trim()
  .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  .withMessage("Incorrect value");

export const userValidation = () => [
  loginValidation,
  passwordValidation,
  emailValidation,
  inputModelValidation,
];
