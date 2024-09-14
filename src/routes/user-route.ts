import { Router } from "express";
import { userValidation } from "../middlewares/user/user-validation";
import { userController } from "./composition-root";
import { authMiddleware } from "../middlewares/auth/auth-basic-middleware";
import { registrationMiddleware } from "../middlewares/auth/registration-middleware";

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
