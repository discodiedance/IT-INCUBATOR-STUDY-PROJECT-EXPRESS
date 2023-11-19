import { body } from "express-validator";
import { inputModelValidation } from "../middlewares/inputModel/input-model-validation";

const nameValidation = body("name")
  .isString()
  .trim()
  .isLength({ min: 1, max: 15 })
  .withMessage("Incorrect name!");

const descriptionValidator = body("description")
  .isString()
  .trim()
  .isLength({ min: 1, max: 500 })
  .withMessage("Incorrect description!");

const websiteUrlValidation = body("websiteUrl")
  .isString()
  .trim()
  .isLength({ min: 1, max: 100 })
  .matches("^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$")
  .withMessage("Incorrect url!");

export const blogPostValidation = () => [
  nameValidation,
  descriptionValidator,
  websiteUrlValidation,
  inputModelValidation,
];
