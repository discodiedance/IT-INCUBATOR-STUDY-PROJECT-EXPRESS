import {
  blogIdValidation,
  contentValidatorValidation,
  shortDescriptionValidation,
  titleValidation,
} from "../middlewares/post/post-middleware";
import { inputModelValidation } from "./../middlewares/inputModel/input-model-validation";

export const postPostValidation = () => [
  blogIdValidation,
  titleValidation,
  shortDescriptionValidation,
  contentValidatorValidation,
  inputModelValidation,
];
