import { UserRepostitory } from "../repositories/user-repository";
import { QueryUserRepository } from "../repositories/query-repository/query-user-repository";

import { userMapper } from "../middlewares/user/user-mapper";

import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { ObjectId } from "mongodb";
import { add } from "date-fns/add";

import { InputUserType } from "../types/user/input";
import { OutputUserType, UserDBType } from "../types/user/output";

export class UserService {
  constructor(
    protected UserRepostitory: UserRepostitory,
    protected QueryUserRepository: QueryUserRepository
  ) {}
  async _generateHash(password: string, salt: string): Promise<string> {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async createUser(newUser: InputUserType): Promise<OutputUserType> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(
      newUser.password,
      passwordSalt
    );

    const createdUser = new UserDBType(
      new ObjectId().toString(),
      {
        login: newUser.login,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        passwordHash,
        passwordSalt,
      },
      {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 5,
        }),
        isConfirmed: false,
      },
      {
        recoveryCode: "",
        expirationDate: null,
      }
    );

    const outputUser = await this.UserRepostitory.createUser(createdUser);

    return userMapper(outputUser);
  }

  async findUserByConfirmationCode(code: string): Promise<UserDBType | null> {
    const foundedUser: UserDBType | null =
      await this.QueryUserRepository.findUserByConfirmationCode(code);
    if (!foundedUser) {
      return null;
    }
    return foundedUser;
  }

  async checkCredentials(
    loginOrEmail: string,
    password: string
  ): Promise<UserDBType | null> {
    const user: UserDBType | null =
      await this.QueryUserRepository.findByLoginOrEmail(loginOrEmail);
    if (!user) return null;

    const passwordHash = await this._generateHash(
      password,
      user.accountData.passwordSalt
    );
    if (user.accountData.passwordHash !== passwordHash) {
      return null;
    }
    return user;
  }
}
