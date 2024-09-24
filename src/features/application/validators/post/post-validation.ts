import { body, param } from "express-validator";
import { inputModelValidation } from "../../validators/inputModel/input-model-validation";
import {
  blogIdInBodyValidation,
  blogIdInParamsValidation,
} from "../blog/blog-validation";
import { notFoundValidation } from "../../validators/inputModel/not-found-validation";
import { queryPostRepository } from "../../../../routes/composition-root";

export const postIdinParamsValidation = param("postId")
  .isString()
  .trim()
  .custom(async (value) => {
    const post = await queryPostRepository.getMappedPostByPostId(value);
    if (!post) {
      throw new Error("Incorrect value");
    }
  })
  .withMessage("Incorrect value");

const titleValidation = body("title")
  .isString()
  .trim()
  .isLength({ min: 5, max: 30 })
  .withMessage("Incorrect value");

const shortDescriptionValidation = body("shortDescription")
  .isString()
  .trim()
  .isLength({ min: 5, max: 100 })
  .withMessage("Incorrect value");

const contentValidation = body("content")
  .isString()
  .trim()
  .isLength({ min: 5, max: 1000 })
  .withMessage("Incorrect value");

export const allCommentsForPostByIdValidation = () => [
  postIdinParamsValidation,
  notFoundValidation,
];

export const postValidation = () => [
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  blogIdInBodyValidation,
  inputModelValidation,
];

export const postBlogIdValidation = () => [
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  inputModelValidation,
  blogIdInParamsValidation,
  notFoundValidation,
];
