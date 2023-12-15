import { userCollection } from "../db/db";
import { InputUserType } from "../types/user/input";
import { UserType } from "../types/user/output";
import bcrypt from "bcrypt";

export class UserService {
  static async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  static async createUser(newUser: InputUserType): Promise<UserType> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(
      newUser.password,
      passwordSalt
    );

    const createdUser: UserType = {
      login: newUser.login,
      email: newUser.email,
      passwordHash,
      passwordSalt,
      createdAt: new Date().toISOString(),
    };

    const result = await userCollection.insertOne({ ...createdUser });
    createdUser.id = result.insertedId.toString();
    return createdUser;
  }

  static async findByLoginOrEmail(loginOrEmail: string) {
    const user = await userCollection.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });

    return user;
  }

  static async checkCredentials(loginOrEmail: string, password: string) {
    const user = await UserService.findByLoginOrEmail(loginOrEmail);

    if (!user) return false;

    const passwordHash = await this._generateHash(password, user.passwordSalt);
    if (user.passwordHash !== passwordHash) {
      return false;
    }
    return true;
  }
}
