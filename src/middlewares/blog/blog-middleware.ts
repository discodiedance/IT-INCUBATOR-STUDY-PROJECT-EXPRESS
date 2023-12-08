import { body } from "express-validator";
import { inputModelValidation } from "../inputModel/input-model-validation";
import notFoundValidation from "../inputModel/not-found-validation";
import { blogIdInParamsValidation } from "../post/post-middleware";

export const nameValidation = body("name")
  .exists()
  .isString()
  .trim()
  .isLength({ min: 1, max: 15 })
  .withMessage("Incorrect name!");

export const descriptionValidation = body("description")
  .isString()
  .trim()
  .isLength({ min: 1, max: 500 })
  .withMessage("Incorrect description!");

export const websiteUrlValidation = body("websiteUrl")
  .isString()
  .trim()
  .isLength({ min: 1, max: 100 })
  .matches("^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$")
  .withMessage("Incorrect url!");

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
