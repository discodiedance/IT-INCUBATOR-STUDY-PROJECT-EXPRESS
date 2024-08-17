import { Router, Response } from "express";
import {
  Params,
  RequestTypeWithQuery,
  RequestWithBody,
  RequestWithParams,
} from "../types/common";
import { InputUserType, SortDataUserType } from "../types/user/input";
import { QueryUserRepository } from "../repositories/query-repository/query-user-repository";
import { UserService } from "../domain/user-service";
import { authMiddleware } from "../middlewares/auth/auth-basic-middleware";
import { UserRepostitory } from "../repositories/user-repository";
import { userValidation } from "../middlewares/user/user-validation";
import { registrationMiddleware } from "../middlewares/auth/registration-middleware";
import { OutputUserType } from "../types/user/output";

export const userRoute = Router({});

userRoute.get(
  "/",
  authMiddleware,
  async (req: RequestTypeWithQuery<SortDataUserType>, res: Response) => {
    const sortData = {
      sortBy: req.query.sortBy,
      sortDirection: req.query.sortDirection,
      pageNumber: req.query.pageNumber,
      pageSize: req.query.pageSize,
      searchLoginTerm: req.query.searchLoginTerm,
      searchEmailTerm: req.query.searchEmailTerm,
    };
    const users = await QueryUserRepository.getAllUsers(sortData);

    res.send(users);
    return;
  }
);

userRoute.post(
  "/",
  registrationMiddleware,
  authMiddleware,
  userValidation(),
  async (req: RequestWithBody<InputUserType>, res: Response) => {
    const user: OutputUserType = await UserService.createUser(req.body);
    res.status(201).send(user);
    return;
  }
);

userRoute.delete(
  "/:id",
  authMiddleware,
  async (req: RequestWithParams<Params>, res: Response) => {
    const id: string = req.params.id;
    const status: boolean = await UserRepostitory.deleteUser(id);

    if (!status) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
    return;
  }
);
