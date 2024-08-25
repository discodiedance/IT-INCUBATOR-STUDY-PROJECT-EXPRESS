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
      passwordRecoveryConfirmation: {
        recoveryCode: "",
        expirationDate: null,
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
    const user: UserDBType | null =
      await UserService.findUserByConfirmationCode(code);
    if (!user) return { result: 400, message: "User is not found" };
    if (user.emailConfirmation.isConfirmed === true)
      return {
        result: 400,
        message: "Confirmartion code is already confirmed",
      };
    if (user.emailConfirmation.confirmationCode !== code)
      return { result: 400, message: "Confirmation code error" };
    if (user.emailConfirmation.expirationDate < new Date())
      return { result: 400, message: "Confirmaton code is expired" };
    await UserRepostitory.updateConfirmation(user.id);
    return { result: 204, message: "Ok" };
  }

  static async resendEmail(email: string): Promise<ResendEmailType> {
    const user: UserDBType | null =
      await QueryUserRepository.findyByEmail(email);
    if (!user) return { result: 400, message: "User is not found" };
    if (user.emailConfirmation.isConfirmed === true)
      return { result: 400, message: "Email is already confirmed" };
    const newCode: string = uuidv4();
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

  static async sendPasswordRecoveryCode(email: string) {
    const user: UserDBType | null =
      await QueryUserRepository.findyByEmail(email);
    if (!user) {
      return { result: 204, message: "OK" };
    } else {
      try {
        const newCode: string = uuidv4();
        const result = await UserRepostitory.addRecoveryPasswordCodeToUserById(
          newCode,
          user.id
        );
        if (!result) {
          return { result: 400, message: "Code wasn't created" };
        }
        await emailsManager.sendPasswordRecoveryMessage(email, newCode);

        return { result: 204, message: "OK" };
      } catch (error) {
        return { result: 400, message: "Something goes wrong..." };
      }
    }
  }

  static async confirPasswordRecoveryCodeAndUpdatePassword(
    newPassword: string,
    code: string
  ) {
    const user: UserDBType | null =
      await QueryUserRepository.findUserByRecoveryConfirmationCode(code);
    if (!user)
      return {
        result: 400,
        message: "User is not exists",
      };
    if (user!.passwordRecoveryConfirmation.expirationDate! < new Date())
      return { result: 400, message: "Confirmaton code is expired" };
    const salt: string | null =
      await QueryUserRepository.findPasswordSaltByUserId(user!.id);
    if (!salt) {
      return { result: 400, message: "Can't change the password" };
    }
    const newPasswordHash: string = await UserService._generateHash(
      newPassword,
      salt
    );
    const status: boolean = await UserRepostitory.updateNewPasswordByUserId(
      newPasswordHash,
      user.id
    );
    if (!status) {
      return { result: 400, message: "Password wasn't updated" };
    }
    return { result: 204, message: "Password is changed" };
  }

  static async loginUser(userId: string, ip: string, title: string) {
    const deviceId: string = uuidv4();

    const accessToken: string = await jwtService.createJWT(userId);

    const refreshToken: string = await jwtService.createRefreshJWT(
      deviceId,
      userId
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

    const accessToken: string = await jwtService.createJWT(user.id);
    const refreshToken: string = await jwtService.createRefreshJWT(
      deviceId,
      user.id
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

    const savedSession: boolean =
      await SecurityRepostiory.updateDevice(updateDeviceData);

    if (!savedSession) return null;

    return { accessToken, refreshToken };
  }
}
