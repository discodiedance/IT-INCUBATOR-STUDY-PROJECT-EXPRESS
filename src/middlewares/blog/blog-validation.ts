import { body } from "express-validator";
import { inputModelValidation } from "../inputModel/input-model-validation";
import notFoundValidation from "../inputModel/not-found-validation";
import { blogIdInParamsValidation } from "../post/post-validation";

export const nameValidation = body("name")
  .exists()
  .isString()
  .trim()
  .isLength({ min: 1, max: 15 })
  .withMessage("Incorrect value");

export const descriptionValidation = body("description")
  .isString()
  .trim()
  .isLength({ min: 1, max: 500 })
  .withMessage("Incorrect value");

export const websiteUrlValidation = body("websiteUrl")
  .isString()
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage("Incorrect value")
  .matches("^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$")
  .withMessage("Incorrect value");

export const allPostsForBlogByIdValidation = () => [
  blogIdInParamsValidation,
  notFoundValidation,
];

export const blogValidation = () => [
  nameValidation,
  descriptionValidation,
  websiteUrlValidation,
  inputModelValidation,
];
