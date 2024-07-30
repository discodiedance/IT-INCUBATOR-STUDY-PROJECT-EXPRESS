import { WithId } from "mongodb";
import { OutputDeviceType } from "../../types/security/output";

export const securityMapper = (devices: WithId<OutputDeviceType>[]) => {
  return devices.map((device) => ({
    deviceId: device.deviceId,
    ip: device.ip.toString(),
    lastActiveDate: device.lastActiveDate,
    title: device.title,
  }));
};
