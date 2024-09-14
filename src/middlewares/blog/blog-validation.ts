import { body, param } from "express-validator";
import { queryBlogRepository } from "../../routes/composition-root";
import { inputModelValidation } from "../inputModel/input-model-validation";
import { notFoundValidation } from "../inputModel/not-found-validation";
import { OutputBlogType } from "../../types/blog/output";

export const blogIdInParamsValidation = param("blogId")
  .isString()
  .trim()
  .custom(async (value) => {
    const blog: OutputBlogType | null =
      await queryBlogRepository.getBlogById(value);

    if (!blog) {
      throw new Error("Incorrect value");
    }
  })
  .withMessage("Incorrect value");

export const blogIdInBodyValidation = body("blogId")
  .isString()
  .trim()
  .custom(async (value, meta) => {
    const blog: OutputBlogType | null =
      await queryBlogRepository.getBlogById(value);

    if (!blog) {
      throw new Error("Incorrect value");
    }
    meta.req.blog = blog;
  })
  .withMessage("Incorrect value");

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
