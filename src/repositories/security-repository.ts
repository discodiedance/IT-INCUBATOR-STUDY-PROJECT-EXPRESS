import { DeviceType, UpdateDeviceType } from "../types/security/input";
import { deviceAuthSessionsCollection } from "../db/db";

export class SecurityRepostiory {
  static async terminateAllDevicesByUserIdExcludeCurrent(
    userId: string,
    deviceId: string
  ): Promise<boolean> {
    const savedDevice = await deviceAuthSessionsCollection.findOne({
      userId: userId,
      deviceId: deviceId,
    });
    const result = await deviceAuthSessionsCollection.deleteMany({
      userId: userId,
      _id: { $ne: savedDevice!._id },
    });
    return result.acknowledged === true;
  }

  static async terminateDeviceByDeviceId(deviceId: string): Promise<boolean> {
    try {
      const result = await deviceAuthSessionsCollection.deleteOne({
        deviceId: deviceId,
      });
      return !!result.deletedCount;
    } catch (e) {
      console.log("not deleted device by deviceId", e);
      return false;
    }
  }

  static async addDevice(inputDevice: DeviceType): Promise<boolean> {
    try {
      await deviceAuthSessionsCollection.insertOne(inputDevice);
      return true;
    } catch (e) {
      console.log("not added device", e);
      return false;
    }
  }

  static async updateDevice(
    updateInputDevice: UpdateDeviceType
  ): Promise<boolean> {
    try {
      const result = await deviceAuthSessionsCollection.updateOne(
        {
          deviceId: updateInputDevice.deviceId,
        },
        {
          $set: {
            expirationDate: updateInputDevice.expirationDate,
            lastActiveDate: updateInputDevice.lastActiveDate,
          },
        }
      );

      return !!result.modifiedCount;
    } catch (e) {
      console.log("not updated device", e);
      return false;
    }
  }
}
