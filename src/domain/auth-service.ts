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
import { ConfirmEmailType, ResendEmailType } from "../types/common";
import { DeviceDBType, UpdateDeviceType } from "../types/security/input";
import { jwtService } from "../aplication/jwt-service";
import { QueryUserRepository } from "./../repositories/query-repository/query-user-repository";
import { SecurityRepostiory } from "../repositories/security-repository";

export class AuthService {
  static async createUserByRegistration(
    inputUser: InputUserType
  ): Promise<OutputUserType | null> {
    const passwordSalt: string = await bcrypt.genSalt(10);
    const passwordHash: string = await UserService._generateHash(
      inputUser.password,
      passwordSalt
    );
    const user: UserDBType = {
      id: new ObjectId().toString(),
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

    emailsManager
      .sendEmailConfirmationMessage(
        user.accountData.email,
        user.emailConfirmation.confirmationCode
      )
      .catch((error) => {
        console.log(error);
      });

    return userMapper(user);
  }

  static async confirmEmail(code: string): Promise<ConfirmEmailType> {
    const user = await UserService.findUserByConfirmationCode(code);
    if (!user) return { result: 400, message: "User is not found" };
    if (user.emailConfirmation.isConfirmed === true)
      return { result: 400, message: "Confirmartion code is not confirmed" };
    if (user.emailConfirmation.confirmationCode !== code)
      return { result: 400, message: "Confirmation code error" };
    if (user.emailConfirmation.expirationDate < new Date())
      return { result: 400, message: "Confirmaton code is expired" };
    await UserRepostitory.updateConfirmation(user.id);
    return { result: 204, message: "Ok" };
  }

  static async resendEmail(email: string): Promise<ResendEmailType> {
    const user = await QueryUserRepository.findyByEmail(email);
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
      await UserRepostitory.deleteUser(user.id.toString());
      return { result: 400, message: "Something goes wrong..." };
    }
  }

  static async loginUser(userId: string, ip: string, title: string) {
    const deviceId = uuidv4();

    const accessToken: string = await jwtService.createJWT(userId);
    const refreshToken: string = await jwtService.createRefreshJWT(
      userId,
      deviceId
    );

    const expDate: string =
      await jwtService.getExpirationDateFromRefreshToken(refreshToken);

    const lastActiveDate: string =
      await jwtService.getIssuedAtFromJWTAccessToken(accessToken);

    const sessionData: DeviceDBType = {
      deviceId,
      ip,
      lastActiveDate: lastActiveDate,
      title,
      userId: userId,
      expirationDate: expDate,
    };

    const isSessionSaved: boolean =
      await SecurityRepostiory.addDevice(sessionData);
    if (!isSessionSaved) {
      return null;
    }
    return { accessToken, refreshToken };
  }

  static async updateRefreshTokens(deviceId: string, userId: string) {
    const user: OutputUserType | null =
      await QueryUserRepository.getUserById(userId);
    if (!user) return null;

    const accessToken: string = await jwtService.createJWT(user.userId);
    const refreshToken: string = await jwtService.createRefreshJWT(
      user.userId,
      deviceId
    );

    const expirationDate: string =
      await jwtService.getExpirationDateFromRefreshToken(refreshToken);
    if (!expirationDate) return null;

    const lastActiveDate: string =
      await jwtService.getIssuedAtFromJWTAccessToken(accessToken);
    if (!lastActiveDate) return null;

    const updateDeviceData: UpdateDeviceType = {
      expirationDate,
      lastActiveDate,
      userId,
      deviceId,
    };

    const isSessionUpdated: boolean =
      await SecurityRepostiory.updateDevice(updateDeviceData);

    if (!isSessionUpdated) return null;

    return { accessToken, refreshToken };
  }
}
