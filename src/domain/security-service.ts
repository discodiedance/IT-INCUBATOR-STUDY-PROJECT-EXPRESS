import { QuerySecurityRepostiory } from "../repositories/query-repository/query-security-repository";
import { SecurityRepostiory } from "../repositories/security-repository";

import { JwtService } from "../aplication/jwt-service";

import {
  CheckUserAndDeviceIdType,
  DeviceDBType,
} from "../types/security/input";

export class SecurityService {
  constructor(
    protected JwtService: JwtService,
    protected SecurityRepostiory: SecurityRepostiory,
    protected QuerySecurityRepostiory: QuerySecurityRepostiory
  ) {}
  async addDevice(sessionData: DeviceDBType): Promise<boolean | null> {
    const createdDevice: boolean =
      await this.SecurityRepostiory.addDevice(sessionData);
    if (!createdDevice) {
      return null;
    }
    return true;
  }

  async terminateDeviceByDeviceId(
    deviceId: string,
    refreshToken: string
  ): Promise<boolean | null> {
    const currentUserId: string | null =
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
    const foundDeviceByDeviceId: DeviceDBType | null =
      await this.QuerySecurityRepostiory.getDeviceByDeviceId(deviceId);
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
      await this.SecurityRepostiory.terminateDeviceByDeviceId(deviceId);
    return status;
  }

  async checkCredentials(refreshToken: string) {
    const userId = await this.JwtService.getUserIdByRefreshToken(refreshToken);
    const deviceId =
      await this.JwtService.getDeviceIdByRefreshToken(refreshToken);
    if (!userId && !deviceId) {
      return null;
    }
    const validatedUserAndDeviceId = new CheckUserAndDeviceIdType(
      deviceId,
      userId
    );

    return validatedUserAndDeviceId;
  }

  async terminateAllDevicesByUserIdExcludeCurrent(
    refreshToken: string
  ): Promise<boolean | null> {
    const userAndDeviceId: CheckUserAndDeviceIdType | null =
      await this.checkCredentials(refreshToken);
    if (!userAndDeviceId) {
      return null;
    }

    const status =
      await this.SecurityRepostiory.terminateAllDevicesByUserIdExcludeCurrent(
        userAndDeviceId
      );
    return status;
  }
}
