import { body, param } from "express-validator";
import { inputModelValidation } from "../inputModel/input-model-validation";
import notFoundValidation from "../inputModel/not-found-validation";
import { QueryPostRepository } from "../../repositories/query-repository/query-post-repository";

export const postIdinParamsValidation = param("postId")
  .isString()
  .trim()
  .custom(async (value) => {
    const post = await QueryPostRepository.getPostById(value);

    if (!post) {
      throw new Error("Incorrect value");
    }
  })
  .withMessage("Incorrect value");

const contentValidation = body("content")
  .isString()
  .trim()
  .isLength({ min: 20, max: 300 })
  .withMessage("Incorrect value");

export const commentValidation = () => [
  contentValidation,
  inputModelValidation,
  notFoundValidation,
];
