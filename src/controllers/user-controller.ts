import { Response } from "express";

import { UserRepostitory } from "../repositories/user-repository";
import { QueryUserRepository } from "../repositories/query-repository/query-user-repository";

import { UserService } from "../domain/user-service";

import {
  RequestTypeWithQuery,
  RequestWithBody,
  RequestWithParams,
  Params,
} from "../types/common";
import { SortDataUserType, InputUserType } from "../types/user/input";
import { OutputUserType } from "../types/user/output";

export class UserController {
  constructor(
    protected UserRepostitory: UserRepostitory,
    protected UserService: UserService,
    protected QueryUserRepository: QueryUserRepository
  ) {}

  async getAllUsers(
    req: RequestTypeWithQuery<SortDataUserType>,
    res: Response
  ) {
    const sortData = {
      sortBy: req.query.sortBy,
      sortDirection: req.query.sortDirection,
      pageNumber: req.query.pageNumber,
      pageSize: req.query.pageSize,
      searchLoginTerm: req.query.searchLoginTerm,
      searchEmailTerm: req.query.searchEmailTerm,
    };
    const users = await this.QueryUserRepository.getAllUsers(sortData);

    res.send(users);
    return;
  }
  async createUser(req: RequestWithBody<InputUserType>, res: Response) {
    const user: OutputUserType = await this.UserService.createUser(req.body);
    res.status(201).send(user);
    return;
  }
  async deleteUser(req: RequestWithParams<Params>, res: Response) {
    const id: string = req.params.id;
    const status: boolean = await this.UserRepostitory.deleteUser(id);

    if (!status) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
    return;
  }
}
