import { Router } from "express";
import { userController } from "./composition-root";
import { authMiddleware } from "../features/application/middlewares/auth/auth-basic-middleware";
import { registrationMiddleware } from "../features/application/middlewares/auth/registration-middleware";
import { userValidation } from "../features/application/validators/user/user-validation";

export const userRoute = Router({});

userRoute.get(
  "/",
  authMiddleware,
  userController.getAllUsers.bind(userController)
);

userRoute.post(
  "/",
  registrationMiddleware,
  authMiddleware,
  userValidation(),
  userController.createUser.bind(userController)
);

userRoute.delete(
  "/:id",
  authMiddleware,
  userController.deleteUser.bind(userController)
);
