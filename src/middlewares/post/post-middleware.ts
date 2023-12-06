import { body, param } from "express-validator";
import { inputModelValidation } from "../inputModel/input-model-validation";
import { QueryBlogRepository } from "../../repositories/query-repository/query-blog-repository";

const blogIdValidation = param("blogId")
  .isString()
  .trim()
  .custom(async (value) => {
    console.log("123123123");
    const blog = await QueryBlogRepository.getBlogById(value);

    if (!blog) {
      console.log("blognotfound");
      throw new Error("Incorrect blogId!");
    }
  })
  .withMessage("Incorrect blogId!");

const titleValidation = body("title")
  .isString()
  .trim()
  .isLength({ min: 5, max: 30 })
  .withMessage("Incorrect title!");

const shortDescriptionValidation = body("shortDescription")
  .isString()
  .trim()
  .isLength({ min: 5, max: 100 })
  .withMessage("Incorrect short description!");

const contentValidatorValidation = body("content")
  .isString()
  .trim()
  .isLength({ min: 5, max: 1000 })
  .withMessage("Incorrect content!");

export const postValidation = () => [
  blogIdValidation,
  titleValidation,
  shortDescriptionValidation,
  contentValidatorValidation,
  inputModelValidation,
];
