import { inject, injectable } from "inversify";

import bcrypt from "bcrypt";

import { OutputUserType } from "../../../types/user/output";
import { UserModel } from "../../domain/entities/user-entity";
import { UserRepository } from "../../infrastructure/repositories/user-repository";
import { QueryUserRepository } from "../../infrastructure/repositories/query-repository/query-user-repository";
import {
  CreateUserAccountDataType,
  CreateUserDataType,
} from "../../../types/user/user-dto";
import { userMapper } from "../mappers/user/user-mapper";

@injectable()
export class UserService {
  constructor(
    @inject(UserRepository) protected UserRepository: UserRepository,
    @inject(QueryUserRepository)
    protected QueryUserRepository: QueryUserRepository
  ) {}

  async _generateHash(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  async createUser(
    newUserAccountData: CreateUserAccountDataType
  ): Promise<OutputUserType | null> {
    const passwordHash = await this._generateHash(newUserAccountData.password);

    const newUser: CreateUserDataType = {
      login: newUserAccountData.login,
      email: newUserAccountData.email,
      passwordHash: passwordHash,
    };

    const createdUser = UserModel.createUser(newUser);
    const user = await this.UserRepository.save(createdUser);

    if (!user) {
      return null;
    }

    return userMapper(createdUser);
  }

  async checkCredentials(loginOrEmail: string, password: string) {
    const user = await this.UserRepository.getUserByLoginOrEmail(loginOrEmail);

    if (!user) {
      return null;
    }

    const isEqual = await bcrypt.compare(
      password,
      user.accountData.passwordHash
    );

    if (!isEqual) {
      return null;
    }

    return user;
  }
}
