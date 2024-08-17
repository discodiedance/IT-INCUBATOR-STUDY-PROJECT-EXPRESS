import { jwtService } from "../aplication/jwt-service";
import { SecurityQueryRepostiory } from "../repositories/query-repository/query-security-repository";
import { SecurityRepostiory } from "../repositories/security-repository";
import {
  CheckUserAndDeviceIdType,
  DeviceDBType,
} from "../types/security/input";

export class SecurityService {
  static async addDevice(sessionData: DeviceDBType): Promise<boolean | null> {
    const createdDevice: boolean =
      await SecurityRepostiory.addDevice(sessionData);
    if (!createdDevice) {
      return null;
    }
    return true;
  }

  static async terminateDeviceByDeviceId(
    deviceId: string,
    refreshToken: string
  ): Promise<boolean | null> {
    const currentUserId: string | null =
      await jwtService.getUserIdByRefreshToken(refreshToken);
    if (!currentUserId) {
      return null;
    }
    const foundDevicesByCurrentUserId =
      await SecurityQueryRepostiory.getAllDevicesByUserId(currentUserId);
    if (
      !foundDevicesByCurrentUserId ||
      foundDevicesByCurrentUserId.length == 0
    ) {
      return null;
    }
    const foundDeviceByDeviceId: DeviceDBType | null =
      await SecurityQueryRepostiory.getDeviceByDeviceId(deviceId);
    if (!foundDeviceByDeviceId) {
      return null;
    }
    const isDeviceFound = foundDevicesByCurrentUserId.find(
      (device) => device.deviceId === foundDeviceByDeviceId!.deviceId
    );

    if (!isDeviceFound) {
      return null;
    }

    const status: boolean =
      await SecurityRepostiory.terminateDeviceByDeviceId(deviceId);
    return status;
  }

  static async terminateAllDevicesByUserIdExcludeCurrent(
    refreshToken: string
  ): Promise<boolean | null> {
    const userAndDeviceId: CheckUserAndDeviceIdType | null =
      await SecurityService.checkCredentials(refreshToken);
    if (!userAndDeviceId) {
      return null;
    }

    const status: boolean =
      await SecurityRepostiory.terminateAllDevicesByUserIdExcludeCurrent(
        userAndDeviceId
      );
    return status;
  }

  static async checkCredentials(refreshToken: string) {
    const userId: string =
      await jwtService.getUserIdByRefreshToken(refreshToken);
    const deviceId: string =
      await jwtService.getDeviceIdByRefreshToken(refreshToken);
    if (!userId && !deviceId) {
      return null;
    }
    const validatedUserAndDeviceId: CheckUserAndDeviceIdType = {
      deviceId,
      userId,
    };
    return validatedUserAndDeviceId;
  }
}
