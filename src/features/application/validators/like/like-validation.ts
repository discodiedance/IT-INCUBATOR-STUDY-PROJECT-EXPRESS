import { body } from "express-validator";

export const likeValidation = body("likeStatus")
  .isString()
  .isIn(["Like", "Dislike", "None"])
  .trim()
  .withMessage("Incorrect value");
