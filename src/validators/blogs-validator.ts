import {
  nameValidation,
  descriptionValidation,
  websiteUrlValidation,
} from "../middlewares/blog/blog-middleware";
import { inputModelValidation } from "../middlewares/inputModel/input-model-validation";

export const blogPostValidation = () => [
  nameValidation,
  descriptionValidation,
  websiteUrlValidation,
  inputModelValidation,
];
