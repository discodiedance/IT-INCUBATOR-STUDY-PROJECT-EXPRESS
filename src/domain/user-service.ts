import { ObjectId, WithId } from "mongodb";
import { userMapper } from "../middlewares/user/user-mapper";
import { InputUserType } from "../types/user/input";
import { add } from "date-fns/add";
import { OutputUserType, UserDBType, UserType } from "../types/user/output";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { UserRepostitory } from "../repositories/user-repository";

export class UserService {
  static async _generateHash(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  static async createUser(newUser: InputUserType): Promise<OutputUserType> {
    const passwordHash = await this._generateHash(newUser.password);

    const createdUser: UserDBType = {
      _id: new ObjectId(),
      accountData: {
        login: newUser.login,
        email: newUser.email,
        passwordHash,
        createdAt: new Date(),
      },
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 5,
        }),
        isConfirmed: false,
      },
    };

    await UserRepostitory.createUser(createdUser);

    return userMapper(createdUser);
  }

  static async findUserByConfirmationCode(code: string) {
    const foundedUser = await UserRepostitory.findUserByConfirmationCode(code);
    return foundedUser;
  }

  static async checkCredentials(
    loginOrEmail: string,
    password: string
  ): Promise<UserDBType | null> {
    const user = await UserRepostitory.findByLoginOrEmail(loginOrEmail);

    if (!user) return null;

    if (!user.emailConfirmation.isConfirmed) {
      return null;
    }

    const passwordHash = await this._generateHash(password);
    if (user.accountData.passwordHash !== passwordHash) {
      return null;
    }
    return user;
  }
}
