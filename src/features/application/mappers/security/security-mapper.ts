import { OutputDeviceType } from "../../../../types/security/output";
import { DeviceDocumentType } from "../../../../types/security/security-entities";

export const securityMapper = (
  devices: DeviceDocumentType[]
): OutputDeviceType[] => {
  return devices.map((device) => ({
    deviceId: device.deviceId,
    ip: device.ip,
    lastActiveDate: device.lastActiveDate,
    title: device.title,
  }));
};
