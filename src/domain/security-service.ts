import { SecurityQueryRepostiory } from "../repositories/query-repository/query-security-repository";
import { SecurityRepostiory } from "../repositories/security-repository";
import { DeviceType } from "../types/security/input";

export class SecurityService {
  static async addDevice(sessionData: DeviceType) {
    const createdDevice = await SecurityRepostiory.addDevice(sessionData);
    if (!createdDevice) {
      throw new Error("Not created device id!");
    }
    return true;
  }

  static async terminateDeviceByDeviceId(
    currentUserId: string,
    deviceId: string
  ) {
    // const foundDevicedIdByCurrentUserId =
    //   await SecurityQueryRepostiory.getDeviceIdByUserId(currentUserId);
    // console.log("foundDeviceId", foundDevicedIdByCurrentUserId);
    // if (foundDevicedIdByCurrentUserId !== deviceId) {
    //   return false;
    // }
    const foundDevicesByCurrentUserId =
      await SecurityQueryRepostiory.getAllDevicesByUserId(currentUserId);
    if (
      !foundDevicesByCurrentUserId ||
      foundDevicesByCurrentUserId.length == 0
    ) {
      return false;
    }
    const foundDeviceByDeviceId =
      await SecurityQueryRepostiory.getDeviceByDeviceId(deviceId);
    if (!foundDeviceByDeviceId) {
      return false;
    }
    const isDeviceFound = foundDevicesByCurrentUserId.find(
      (device) => device.deviceId === foundDeviceByDeviceId!.deviceId
    );

    if (!isDeviceFound) {
      return false;
    }

    const status = await SecurityRepostiory.terminateDeviceByDeviceId(deviceId);
    return status;
  }
}
