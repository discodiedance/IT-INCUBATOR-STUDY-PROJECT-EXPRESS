import { WithId } from "mongodb";
import { deviceAuthSessionsCollection } from "../../db/db";
import { securityMapper } from "../../middlewares/security/security-mapper";
import { DeviceType } from "../../types/security/input";
import { OutputDeviceType } from "../../types/security/output";

export class SecurityQueryRepostiory {
  static async getAllDevicesByUserId(
    userId: string
  ): Promise<OutputDeviceType[] | null> {
    const allDevices = await deviceAuthSessionsCollection
      .find({ userId: userId })
      .toArray();
    if (!allDevices) {
      return null;
    }
    return securityMapper(allDevices);
  }

  static async getDeviceByDeviceId(
    deviceId: string
  ): Promise<WithId<DeviceType> | null> {
    const device = await deviceAuthSessionsCollection.findOne({
      deviceId: deviceId,
    });
    if (!device) {
      return null;
    }
    return device;
  }

  static async getDeviceIdByUserId(userId: string): Promise<string | null> {
    const device = await deviceAuthSessionsCollection.findOne({
      userId: userId,
    });
    if (!device) {
      return null;
    }
    return device.deviceId;
  }

  static async findExpDateByUserId(userId: string): Promise<string | null> {
    const device = await deviceAuthSessionsCollection.findOne({
      userId: userId,
    });
    if (!device) {
      return null;
    }
    return device.expirationDate;
  }

  static async findUserIdbyDeviceId(
    deviceId: string
  ): Promise<WithId<DeviceType> | null> {
    const userId = await deviceAuthSessionsCollection.findOne({
      userId: deviceId,
    });
    if (!userId) {
      return null;
    }
    return userId;
  }
}
