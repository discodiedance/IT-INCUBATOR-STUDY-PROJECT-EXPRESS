import { inject, injectable } from "inversify";

import { InputCreateDeviceDataType } from "../../../types/security/input";
import { QuerySecurityRepository } from "../../infrastructure/repositories/query-repository/query-security-repository";
import { SecurityRepository } from "../../infrastructure/repositories/security-repository";
import { JwtService } from "./jwt-service";
import { DevicesModel } from "../../domain/entities/security-entity";
import {
  CreateDeviceDataType,
  DeviceIdAndUserIdDataType,
} from "../../../types/security/security-dto";

@injectable()
export class SecurityService {
  constructor(
    @inject(JwtService) protected JwtService: JwtService,
    @inject(SecurityRepository)
    protected SecurityRepository: SecurityRepository,
    @inject(QuerySecurityRepository)
    protected QuerySecurityRepostiory: QuerySecurityRepository
  ) {}

  async createDevice(newDevice: CreateDeviceDataType): Promise<boolean | null> {
    const createdDevice = DevicesModel.createDevice(newDevice);
    const device = await this.SecurityRepository.save(createdDevice);

    if (!device) {
      return null;
    }
    return true;
  }

  async terminateDeviceByDeviceId(
    deviceId: string,
    refreshToken: string
  ): Promise<boolean | null> {
    const currentUserId =
      await this.JwtService.getUserIdByRefreshToken(refreshToken);
    if (!currentUserId) {
      return null;
    }
    const foundDevicesByCurrentUserId =
      await this.QuerySecurityRepostiory.getAllDevicesByUserId(currentUserId);
    if (
      !foundDevicesByCurrentUserId ||
      foundDevicesByCurrentUserId.length == 0
    ) {
      return null;
    }
    const foundDeviceByDeviceId =
      await this.SecurityRepository.getDeviceByDeviceId(deviceId);
    if (!foundDeviceByDeviceId) {
      return null;
    }
    const isDeviceFound = foundDevicesByCurrentUserId.find(
      (device) => device.deviceId === foundDeviceByDeviceId.deviceId
    );

    if (!isDeviceFound) {
      return null;
    }

    const status =
      await this.SecurityRepository.terminateDeviceByDeviceId(deviceId);
    return status;
  }

  async checkCredentials(refreshToken: string) {
    const userId = await this.JwtService.getUserIdByRefreshToken(refreshToken);
    const deviceId =
      await this.JwtService.getDeviceIdByRefreshToken(refreshToken);
    if (!userId && !deviceId) {
      return null;
    }
    const validatedUserAndDeviceId = new DeviceIdAndUserIdDataType(
      deviceId,
      userId
    );

    return validatedUserAndDeviceId;
  }

  async terminateAllDevicesByUserIdExcludeCurrent(
    refreshToken: string
  ): Promise<boolean | null> {
    const userAndDeviceId = await this.checkCredentials(refreshToken);
    if (!userAndDeviceId) {
      return null;
    }

    const status =
      await this.SecurityRepository.terminateAllDevicesByUserIdExcludeCurrent(
        userAndDeviceId
      );
    return status;
  }
}
