import { ObjectId } from "mongodb";
import { userMapper } from "../middlewares/user/user-mapper";
import { InputUserType } from "../types/user/input";
import { add } from "date-fns/add";
import { OutputUserType, UserDBType } from "../types/user/output";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { UserRepostitory } from "../repositories/user-repository";
import { QueryUserRepository } from "../repositories/query-repository/query-user-repository";

export class UserService {
  static async _generateHash(password: string, salt: string): Promise<string> {
    const hash: string = await bcrypt.hash(password, salt);
    return hash;
  }

  static async createUser(newUser: InputUserType): Promise<OutputUserType> {
    const passwordSalt: string = await bcrypt.genSalt(10);
    const passwordHash: string = await this._generateHash(
      newUser.password,
      passwordSalt
    );

    const createdUser: UserDBType = {
      id: new ObjectId().toString(),
      accountData: {
        login: newUser.login,
        email: newUser.email,
        createdAt: new Date(),
        passwordHash,
        passwordSalt,
      },
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 5,
        }),
        isConfirmed: false,
      },
      passwordRecoveryConfirmation: {
        recoveryCode: "",
        expirationDate: null,
      },
    };

    const outputUser: UserDBType =
      await UserRepostitory.createUser(createdUser);

    return userMapper(outputUser);
  }

  static async findUserByConfirmationCode(
    code: string
  ): Promise<UserDBType | null> {
    const foundedUser: UserDBType | null =
      await QueryUserRepository.findUserByConfirmationCode(code);
    if (!foundedUser) {
      return null;
    }
    return foundedUser;
  }

  static async checkCredentials(
    loginOrEmail: string,
    password: string
  ): Promise<UserDBType | null> {
    const user: UserDBType | null =
      await QueryUserRepository.findByLoginOrEmail(loginOrEmail);
    if (!user) return null;

    const passwordHash: string = await this._generateHash(
      password,
      user.accountData.passwordSalt
    );
    if (user.accountData.passwordHash !== passwordHash) {
      return null;
    }
    return user;
  }
}
