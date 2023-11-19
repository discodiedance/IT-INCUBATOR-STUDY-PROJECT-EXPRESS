import { body } from "express-validator";
import { BlogRepository } from "../repositories/blog-repositry";
import { inputModelValidation } from "./../middlewares/inputModel/input-model-validation";

const blogIdValidation = body("blogId")
  .isString()
  .trim()
  .custom((value) => {
    const blog = BlogRepository.getBlogById(value);

    if (!blog) {
      throw new Error("Incorrect blogId!");
    }
    return true;
  })
  .withMessage("Incorrect blogId!");

const titleValidator = body("title")
  .isString()
  .trim()
  .isLength({ min: 5, max: 30 })
  .withMessage("Incorrect title!");

const shortDescriptionValidator = body("shortDescription")
  .isString()
  .trim()
  .isLength({ min: 5, max: 100 })
  .withMessage("Incorrect short description!");

const contentValidatorValidator = body("content")
  .isString()
  .trim()
  .isLength({ min: 5, max: 1000 })
  .withMessage("Incorrect content!");

export const postPostValidation = () => [
  blogIdValidation,
  titleValidator,
  shortDescriptionValidator,
  contentValidatorValidator,
  inputModelValidation,
];
