import { body, param } from "express-validator";
import { inputModelValidation } from "../inputModel/input-model-validation";
import { postIdinParamsValidation } from "../post/post-validation";
import { notFoundValidation } from "../inputModel/not-found-validation";
import { commentRepository } from "../../../../routes/composition-root";
import { likeValidation } from "../like/like-validation";

const commentIdinParamsValidation = param("commentId")
  .isString()
  .trim()
  .custom(async (value) => {
    const comment = await commentRepository.getCommentByCommentId(value);
    if (!comment) {
      throw new Error("Incorrect value");
    }
  })
  .withMessage("Incorrect value");

const commentIdParamsForGetCommentValidation = param("id")
  .isString()
  .trim()
  .custom(async (value) => {
    const comment = await commentRepository.getCommentByCommentId(value);
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

export const commentIdValidation = () => [
  commentIdParamsForGetCommentValidation,
  notFoundValidation,
];
