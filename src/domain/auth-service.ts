import { ObjectId } from "mongodb";
import { add } from "date-fns/add";
import { v4 as uuidv4 } from "uuid";
import { UserService } from "./user-service";
import { OutputUserType, UserDBType } from "../types/user/output";
import { UserRepostitory } from "../repositories/user-repository";
import { InputUserType } from "../types/user/input";
import { userMapper } from "../middlewares/user/user-mapper";
import { emailsManager } from "../managers/email-manager";

export class authService {
  static async createUserByRegistration(
    inputUser: InputUserType
  ): Promise<OutputUserType | null> {
    const passwordHash = await UserService._generateHash(inputUser.password);
    const user: UserDBType = {
      _id: new ObjectId(),
      accountData: {
        login: inputUser.login,
        email: inputUser.email,
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

    await UserRepostitory.createUser(user);

    try {
      await emailsManager.sendEmailConfirmationMessage(
        user.accountData.email,
        user.emailConfirmation.confirmationCode
      );
    } catch (error) {
      console.log("37", error);
      await UserRepostitory.deleteUser(user._id.toString());
      return null;
    }
    return userMapper(user);
  }

  static async confirmEmail(code: string): Promise<boolean> {
    let user = await UserService.findUserByConfirmationCode(code);
    if (!user) return false;
    if (user.emailConfirmation.isConfirmed) return false;
    if (user.emailConfirmation.confirmationCode !== code) return false;
    if (user.emailConfirmation.expirationDate < new Date()) return false;
    let result = await UserRepostitory.updateConfirmation(user._id);
    return result;
  }

  static async resendEmail(email: string): Promise<any> {
    let user = await UserRepostitory.findByLoginOrEmail(email);
    if (!user) return null;
    try {
      await emailsManager.resendConfirmationMessage(
        user.accountData.email,
        user.emailConfirmation.confirmationCode
      );
    } catch (error) {
      console.log("68", error);
      await UserRepostitory.deleteUser(user._id.toString());
      return null;
    }
  }
}
