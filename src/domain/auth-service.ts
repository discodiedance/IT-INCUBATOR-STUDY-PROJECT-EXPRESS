import { SecurityRepostiory } from "../repositories/security-repository";
import { UserRepostitory } from "./../repositories/user-repository";
import { QueryUserRepository } from "./../repositories/query-repository/query-user-repository";

import { EmailsManager } from "../managers/email-manager";
import { UserService } from "./user-service";
import { JwtService } from "../aplication/jwt-service";
import { userMapper } from "../middlewares/user/user-mapper";

import { ObjectId } from "mongodb";
import { add } from "date-fns/add";
import { v4 as uuidv4 } from "uuid";

import { OutputUserType, UserDBType } from "../types/user/output";
import { InputUserType } from "../types/user/input";
import bcrypt from "bcrypt";
import { ConfirmEmailType, ResendEmailType } from "../types/common";
import { DeviceDBType, UpdateDeviceType } from "../types/security/input";

export class AuthService {
  constructor(
    protected EmailsManager: EmailsManager,
    protected JwtService: JwtService,
    protected UserService: UserService,
    protected UserRepostitory: UserRepostitory,
    protected SecurityRepostiory: SecurityRepostiory,
    protected QueryUserRepository: QueryUserRepository
  ) {}
  async createUserByRegistration(
    inputUser: InputUserType
  ): Promise<OutputUserType | null> {
    const passwordSalt: string = await bcrypt.genSalt(10);
    const passwordHash: string = await this.UserService._generateHash(
      inputUser.password,
      passwordSalt
    );
    const user = new UserDBType(
      new ObjectId().toString(),
      {
        email: inputUser.email,
        login: inputUser.login,
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

    await this.UserRepostitory.createUser(user);

    await this.EmailsManager.sendEmailConfirmationMessage(
      user.accountData.email,
      user.emailConfirmation.confirmationCode
    ).catch((error) => {
      console.log(error);
    });

    return userMapper(user);
  }

  async confirmEmail(code: string): Promise<ConfirmEmailType> {
    const user: UserDBType | null =
      await this.UserService.findUserByConfirmationCode(code);
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
    await this.UserRepostitory.updateConfirmation(user.id);
    return { result: 204, message: "Ok" };
  }

  async resendEmail(email: string): Promise<ResendEmailType> {
    const user: UserDBType | null =
      await this.QueryUserRepository.findyByEmail(email);
    if (!user) return { result: 400, message: "User is not found" };
    if (user.emailConfirmation.isConfirmed === true)
      return { result: 400, message: "Email is already confirmed" };
    const newCode: string = uuidv4();
    await this.UserRepostitory.updateConfirmationCode(newCode, email);
    try {
      await this.EmailsManager.resendConfirmationMessage(
        user.accountData.email,
        newCode
      );
      return { result: 204, message: "OK" };
    } catch (error) {
      await this.UserRepostitory.deleteUser(user.id.toString());
      return { result: 400, message: "Something goes wrong..." };
    }
  }

  async sendPasswordRecoveryCode(email: string) {
    const user: UserDBType | null =
      await this.QueryUserRepository.findyByEmail(email);
    if (!user) {
      return { result: 204, message: "OK" };
    } else {
      try {
        const newCode = uuidv4();
        const result =
          await this.UserRepostitory.addRecoveryPasswordCodeToUserById(
            newCode,
            user.id
          );
        if (!result) {
          return { result: 400, message: "Code wasn't created" };
        }
        await this.EmailsManager.sendPasswordRecoveryMessage(email, newCode);

        return { result: 204, message: "OK" };
      } catch (error) {
        return { result: 400, message: "Something goes wrong..." };
      }
    }
  }

  async confirPasswordRecoveryCodeAndUpdatePassword(
    newPassword: string,
    code: string
  ) {
    const user: UserDBType | null =
      await this.QueryUserRepository.findUserByRecoveryConfirmationCode(code);
    if (!user)
      return {
        result: 400,
        message: "User is not exists",
      };
    if (user!.passwordRecoveryConfirmation.expirationDate! < new Date())
      return { result: 400, message: "Confirmaton code is expired" };
    const salt: string | null =
      await this.QueryUserRepository.findPasswordSaltByUserId(user!.id);
    if (!salt) {
      return { result: 400, message: "Can't change the password" };
    }
    const newPasswordHash = await this.UserService._generateHash(
      newPassword,
      salt
    );
    const status = await this.UserRepostitory.updateNewPasswordByUserId(
      newPasswordHash,
      user.id
    );
    if (!status) {
      return { result: 400, message: "Password wasn't updated" };
    }
    return { result: 204, message: "Password is changed" };
  }

  async loginUser(userId: string, ip: string, title: string) {
    const deviceId = uuidv4();
    const accessToken = await this.JwtService.createJWT(userId);
    const refreshToken = await this.JwtService.createRefreshJWT(
      deviceId,
      userId
    );

    const expDate =
      await this.JwtService.getExpirationDateFromRefreshToken(refreshToken);

    const lastActiveDate =
      await this.JwtService.getIssuedAtFromJWTAccessToken(accessToken);

    const sessionData = new DeviceDBType(
      deviceId,
      ip,
      lastActiveDate,
      title,
      userId,
      expDate
    );

    const isSessionSaved = await this.SecurityRepostiory.addDevice(sessionData);
    if (!isSessionSaved) {
      return null;
    }

    return { accessToken, refreshToken };
  }

  async updateRefreshTokens(deviceId: string, userId: string) {
    const user: OutputUserType | null =
      await this.QueryUserRepository.getUserById(userId);
    if (!user) return null;

    const accessToken = await this.JwtService.createJWT(user.id);
    const refreshToken = await this.JwtService.createRefreshJWT(
      deviceId,
      user.id
    );

    const expirationDate =
      await this.JwtService.getExpirationDateFromRefreshToken(refreshToken);
    if (!expirationDate) return null;

    const lastActiveDate =
      await this.JwtService.getIssuedAtFromJWTAccessToken(accessToken);
    if (!lastActiveDate) return null;

    const updateDeviceData: UpdateDeviceType = {
      expirationDate,
      lastActiveDate,
      userId,
      deviceId,
    };

    const savedSession =
      await this.SecurityRepostiory.updateDevice(updateDeviceData);

    if (!savedSession) return null;

    return { accessToken, refreshToken };
  }
}
