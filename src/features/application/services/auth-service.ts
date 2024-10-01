import { inject, injectable } from "inversify";
import { EmailsManager } from "../managers/email-manager";
import { UserService } from "./user-service";
import { v4 as uuidv4 } from "uuid";
import { ConfirmEmailType, ResendEmailType } from "../../../types/common";
import { QueryUserRepository } from "../../infrastructure/repositories/query-repository/query-user-repository";
import { SecurityRepository } from "../../infrastructure/repositories/security-repository";
import { UserRepository } from "../../infrastructure/repositories/user-repository";
import { JwtService } from "./jwt-service";
import { UserModel } from "../../domain/entities/user-entity";
import { QuerySecurityRepository } from "./../../infrastructure/repositories/query-repository/query-security-repository";
import { SecurityService } from "./security-service";
import { CreateDeviceDataType } from "../../../types/security/security-dto";
import {
  CreateUserAccountDataType,
  CreateUserDataType,
} from "../../../types/user/user-dto";
import { ObjectId } from "mongodb";

@injectable()
export class AuthService {
  constructor(
    @inject(SecurityService) protected SecurityService: SecurityService,
    @inject(EmailsManager) protected EmailsManager: EmailsManager,
    @inject(JwtService) protected JwtService: JwtService,
    @inject(UserService) protected UserService: UserService,
    @inject(UserRepository) protected UserRepository: UserRepository,
    @inject(SecurityRepository)
    protected SecurityRepository: SecurityRepository,
    @inject(QueryUserRepository)
    protected QueryUserRepository: QueryUserRepository,
    @inject(QuerySecurityRepository)
    protected QuerySecurityRepository: QuerySecurityRepository
  ) {}

  async createUserByRegistration(
    newUserAccountData: CreateUserAccountDataType
  ): Promise<boolean | null> {
    const passwordHash = await this.UserService._generateHash(
      newUserAccountData.password
    );

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

    await this.EmailsManager.sendEmailConfirmationMessage(
      createdUser.accountData.email,
      createdUser.emailConfirmation.confirmationCode
    ).catch((e) => {
      console.log(e);
      return { result: 400, message: "The message wasn't sent" };
    });

    return true;
  }

  async confirmEmail(code: string): Promise<ConfirmEmailType> {
    const user = await this.UserRepository.getUserByConfirmationCode(code);
    if (!user) return { result: 400, message: "User is not found" };

    if (user.isUserConfirmationCodeConfirmed())
      return {
        result: 400,
        message: "Confirmartion code is already confirmed",
      };

    if (!user.isUserConfirmationCodeEqual(code))
      return { result: 400, message: "Confirmation code error" };

    if (user.isUserConfirmationCodeExpired())
      return { result: 400, message: "Confirmaton code is expired" };

    user.updateEmailConfirmation(user);
    const updatedEmailConfirmationUser = await this.UserRepository.save(user);
    if (!updatedEmailConfirmationUser) {
      return { result: 500, message: "Some problems..." };
    }
    return { result: 204, message: "Ok" };
  }

  async registartionEmailResending(email: string): Promise<ResendEmailType> {
    const user = await this.UserRepository.getUserByEmail(email);
    if (!user) {
      return { result: 400, message: "User is not found" };
    }
    if (user.isUserConfirmationCodeConfirmed())
      return { result: 400, message: "Email is already confirmed" };

    try {
      const newCode = uuidv4();
      user.updateEmailConfirmationCode(newCode);
      await this.UserRepository.save(user);
      this.EmailsManager.resendConfirmationMessage(
        user.accountData.email,
        newCode
      );
      return { result: 204, message: "OK" };
    } catch (error) {
      await this.UserRepository.deleteUser(user.id);
      return { result: 400, message: "Something goes wrong..." };
    }
  }

  async sendPasswordRecoveryCode(email: string) {
    const user = await this.UserRepository.getUserByEmail(email);

    if (!user) {
      return { result: 204, message: "OK" };
    }

    try {
      const newCode = uuidv4();
      user.addRecoveryPasswordCodeToUser(newCode);
      await this.UserRepository.save(user);
      this.EmailsManager.sendPasswordRecoveryMessage(email, newCode);
      return { result: 204, message: "OK" };
    } catch (error) {
      return { result: 400, message: "Something goes wrong..." };
    }
  }

  async confirPasswordRecoveryCodeAndUpdatePassword(
    newPassword: string,
    recoveryCode: string
  ) {
    const user =
      await this.UserRepository.getUserByRecoveryConfirmationCode(recoveryCode);

    if (!user)
      return {
        result: 400,
        message: "User is not exists",
      };

    if (user.isUserConfirmationCodeExpired())
      return { result: 400, message: "Confirmaton code is expired" };

    const newPasswordHash = await this.UserService._generateHash(newPassword);

    user.updateNewPassword(newPasswordHash);
    const updatedUser = await this.UserRepository.save(user);

    if (!updatedUser) {
      return { result: 500, message: "Password is not changed" };
    }

    return { result: 204, message: "Password is changed" };
  }

  async loginUser(userId: string, ip: string, title: string) {
    const deviceId = new ObjectId().toString();
    const accessToken = await this.JwtService.createJWT(userId);
    const refreshToken = await this.JwtService.createRefreshJWT(
      deviceId,
      userId
    );

    const expirationDate =
      await this.JwtService.getExpirationDateFromRefreshToken(refreshToken);

    const lastActiveDate =
      await this.JwtService.getIssuedAtFromJWTAccessToken(accessToken);

    const deviceCreateData: CreateDeviceDataType = {
      deviceId,
      ip,
      lastActiveDate,
      title,
      userId,
      expirationDate,
    };

    const createdDevice =
      await this.SecurityService.createDevice(deviceCreateData);
    if (!createdDevice) {
      return null;
    }

    return { accessToken, refreshToken };
  }

  async updateRefreshTokens(deviceId: string, userId: string) {
    const user = await this.QueryUserRepository.getMappedUserByUserId(userId);
    if (!user) {
      return null;
    }

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

    const device = await this.SecurityRepository.getDeviceByDeviceId(deviceId);
    if (!device) {
      return null;
    }
    device.updateDevice(expirationDate, lastActiveDate);
    const updatedDevice = await this.SecurityRepository.save(device);
    if (!updatedDevice) {
      return null;
    }
    return { accessToken, refreshToken };
  }
}
