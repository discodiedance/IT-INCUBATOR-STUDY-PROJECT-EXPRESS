import { ObjectId } from "mongodb";
import { add } from "date-fns/add";
import { v4 as uuidv4 } from "uuid";
import { UserService } from "./user-service";
import { OutputUserType, UserDBType } from "../types/user/output";
import { UserRepostitory } from "../repositories/user-repository";
import { InputUserType } from "../types/user/input";
import { userMapper } from "../middlewares/user/user-mapper";
import { emailsManager } from "../managers/email-manager";
import bcrypt from "bcrypt";

export class authService {
  static async createUserByRegistration(
    inputUser: InputUserType
  ): Promise<OutputUserType | null> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await UserService._generateHash(
      inputUser.password,
      passwordSalt
    );
    const user: UserDBType = {
      _id: new ObjectId(),
      accountData: {
        login: inputUser.login,
        email: inputUser.email,
        passwordHash,
        passwordSalt,
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
      await UserRepostitory.deleteUser(user._id.toString());
      return null;
    }
    return userMapper(user);
  }

  static async confirmEmail(code: string): Promise<any> {
    const user = await UserService.findUserByConfirmationCode(code);
    if (!user) return { result: 400, message: "User is not found" };
    if (user.emailConfirmation.isConfirmed === true)
      return { result: 400, message: "Confirmartion code is not confirmed" };
    if (user.emailConfirmation.confirmationCode !== code)
      return { result: 400, message: "Confirmation code error" };
    if (user.emailConfirmation.expirationDate < new Date())
      return { result: 400, message: "Confirmaton code is expired" };
    await UserRepostitory.updateConfirmation(user._id);
    return { result: 204, message: "Ok" };
  }

  static async resendEmail(email: string): Promise<any> {
    const user = await UserRepostitory.findyByEmail(email);
    if (!user) return { result: 400, message: "User is not found" };
    if (user.emailConfirmation.isConfirmed === true)
      return { result: 400, message: "Email is already confirmed" };
    const newCode = uuidv4();
    await UserRepostitory.updateConfirmationCode(newCode, email);
    try {
      await emailsManager.resendConfirmationMessage(
        user.accountData.email,
        newCode
      );
      return { result: 204, message: "OK" };
    } catch (error) {
      await UserRepostitory.deleteUser(user._id.toString());
      return { result: 400, message: "Something goes wrong..." };
    }
  }
}
