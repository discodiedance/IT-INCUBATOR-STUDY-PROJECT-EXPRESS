import { body } from "express-validator";
import { BlogRepository } from "../../repositories/blog-repositry";

export const blogIdValidation = body("blogId")
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

export const titleValidation = body("title")
  .isString()
  .trim()
  .isLength({ min: 5, max: 30 })
  .withMessage("Incorrect title!");

export const shortDescriptionValidation = body("shortDescription")
  .isString()
  .trim()
  .isLength({ min: 5, max: 100 })
  .withMessage("Incorrect short description!");

export const contentValidatorValidation = body("content")
  .isString()
  .trim()
  .isLength({ min: 5, max: 1000 })
  .withMessage("Incorrect content!");
