import { body, param } from "express-validator";
import { inputModelValidation } from "../inputModel/input-model-validation";
import { QueryBlogRepository } from "../../repositories/query-repository/query-blog-repository";
import notFoundValidation from "../inputModel/not-found-validation";
import { postIdinparamsValidation } from "../comment/comment-validation";

export const blogIdInParamsValidation = param("blogId")
  .isString()
  .trim()
  .custom(async (value) => {
    const blog = await QueryBlogRepository.getBlogById(value);

    if (!blog) {
      throw new Error("Incorrect value");
    }
  })
  .withMessage("Incorrect value");

export const blogIdInBodyValidation = body("blogId")
  .isString()
  .trim()
  .custom(async (value, meta) => {
    const blog = await QueryBlogRepository.getBlogById(value);

    if (!blog) {
      throw new Error("Incorrect value");
    }
    meta.req.blog = blog;
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
  postIdinparamsValidation,
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
