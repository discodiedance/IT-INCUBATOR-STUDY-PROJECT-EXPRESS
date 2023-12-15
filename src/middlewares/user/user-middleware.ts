import { body } from "express-validator";
import { inputModelValidation } from "../inputModel/input-model-validation";

export const loginValidation = body("login")
  .isString()
  .trim()
  .isLength({ min: 3, max: 10 })
  .matches("^[a-zA-Z0-9_-]*$")
  .withMessage("Incorrect login");

export const passwordValidation = body("password")
  .isString()
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage("Incorrect password");

export const emailValidation = body("email")
  .isString()
  .trim()
  .matches("^[w-.]+@([w-]+.)+[w-]{2,4}$");

export const userValidation = () => [
  loginValidation,
  passwordValidation,
  emailValidation,
  inputModelValidation,
];
