import { body, param } from "express-validator";

import { inputModelValidation } from "../inputModel/input-model-validation";
import { postIdinParamsValidation } from "../post/post-validation";
import { notFoundValidation } from "../inputModel/not-found-validation";
import { queryCommentRepository } from "../../../../routes/composition-root";

const commentIdinParamsValidation = param("commentId")
  .isString()
  .trim()
  .custom(async (value) => {
    const comment =
      await queryCommentRepository.getMappedCommentByCommentId(value);
    if (!comment) {
      throw new Error("Incorrect value");
    }
  })
  .withMessage("Incorrect value");

const contentValidation = body("content")
  .isString()
  .trim()
  .isLength({ min: 20, max: 300 })
  .withMessage("Incorrect value");

const likeValidation = body("likeStatus")
  .isString()
  .isIn(["Like", "Dislike", "None"])
  .trim()
  .withMessage("Incorrect value");

export const commentCreationValidation = () => [
  contentValidation,
  inputModelValidation,
  postIdinParamsValidation,
  notFoundValidation,
];

export const commentValidation = () => [
  contentValidation,
  inputModelValidation,
  commentIdinParamsValidation,
  notFoundValidation,
];

export const commentLikeValidation = () => [
  likeValidation,
  inputModelValidation,
  commentIdinParamsValidation,
  notFoundValidation,
];
