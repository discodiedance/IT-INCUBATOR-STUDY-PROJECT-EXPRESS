import { InputDeviceType } from "../../types/security/input";

export const securityMapper = (devices: InputDeviceType[]) => {
  return devices.map((device) => ({
    deviceId: device.deviceId,
    ip: device.ip,
    lastActiveDate: device.lastActiveDate,
    title: device.title,
  }));
};
