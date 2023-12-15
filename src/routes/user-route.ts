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
import { authMiddleware } from "../middlewares/auth/auth-middleware";
import { UserRepostitory } from "../repositories/user-repository";
import { userValidation } from "../middlewares/user/user-middleware";

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

    return res.send(users);
  }
);

userRoute.post(
  "/",
  authMiddleware,
  userValidation(),
  async (req: RequestWithBody<InputUserType>, res: Response) => {
    const user = await UserService.createUser(req.body);
    return res.status(201).send(user);
  }
);

userRoute.delete("/:id", authMiddleware);
async (req: RequestWithParams<Params>, res: Response) => {
  const id = req.params.id;
  const status = await UserRepostitory.deleteUser(id);

  if (!status) {
    res.sendStatus(404);
    return;
  }
  return res.sendStatus(204);
};
