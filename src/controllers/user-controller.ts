import { Response } from "express";
import { inject, injectable } from "inversify";
import { UserService } from "../features/application/services/user-service";
import {
  RequestTypeWithQuery,
  RequestWithBody,
  RequestWithParams,
  Params,
} from "../types/common";
import {
  InputCreateUserAccountDataType,
  InputUserSortDataUserType,
} from "../types/user/input";
import { QueryUserRepository } from "../features/infrastructure/repositories/query-repository/query-user-repository";
import { UserRepository } from "../features/infrastructure/repositories/user-repository";
import {
  CreateUserAccountDataType,
  UserSortDataUserType,
} from "../types/user/user-dto";

@injectable()
export class UserController {
  constructor(
    @inject(UserRepository) protected UserRepository: UserRepository,
    @inject(UserService) protected UserService: UserService,
    @inject(QueryUserRepository)
    protected QueryUserRepository: QueryUserRepository
  ) {}

  async getAllUsers(
    req: RequestTypeWithQuery<InputUserSortDataUserType>,
    res: Response
  ) {
    const sortData: UserSortDataUserType = {
      sortBy: req.query.sortBy,
      sortDirection: req.query.sortDirection,
      pageNumber: req.query.pageNumber,
      pageSize: req.query.pageSize,
      searchLoginTerm: req.query.searchLoginTerm,
      searchEmailTerm: req.query.searchEmailTerm,
    };

    const users = await this.QueryUserRepository.getAllUsers(sortData);

    res.status(200).send(users);
    return;
  }

  async createUser(
    req: RequestWithBody<InputCreateUserAccountDataType>,
    res: Response
  ) {
    const inputUserData: CreateUserAccountDataType = {
      login: req.body.login,
      password: req.body.password,
      email: req.body.email,
    };

    const user = await this.UserService.createUser(inputUserData);

    if (!user) {
      res.sendStatus(500);
      return;
    }
    res.status(201).send(user);
    return;
  }

  async deleteUser(req: RequestWithParams<Params>, res: Response) {
    const status = await this.UserRepository.deleteUser(req.params.id);

    if (!status) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
    return;
  }
}
