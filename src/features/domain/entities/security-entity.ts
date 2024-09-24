import mongoose from "mongoose";

import {
  DeviceDBMethodsType,
  DeviceModelFullType,
} from "../../../types/security/security-entities";
import {
  CreateDeviceDataType,
  DeviceDBType,
} from "../../../types/security/security-dto";

export const DevicesSchema = new mongoose.Schema<
  DeviceDBType,
  DeviceModelFullType,
  DeviceDBMethodsType
>({
  deviceId: { type: String, require: true },
  ip: { type: String, require: true },
  lastActiveDate: { type: String, require: true },
  title: { type: String, require: true },
  userId: { type: String, require: true },
  expirationDate: { type: String, require: true },
});

DevicesSchema.static(
  "createDevice",
  function createDevice(newDevice: CreateDeviceDataType) {
    const device = new this();

    device.deviceId = newDevice.deviceId;
    device.ip = newDevice.ip;
    device.lastActiveDate = newDevice.lastActiveDate;
    device.title = newDevice.title;
    device.userId = newDevice.userId;
    device.expirationDate = newDevice.expirationDate;

    return device;
  }
);

DevicesSchema.method(
  "updateDevice",
  function updateDevice(expirationDate: string, lastActiveDate: string) {
    this.expirationDate = expirationDate;
    this.lastActiveDate = lastActiveDate;
  }
);

export const DevicesModel = mongoose.model<DeviceDBType, DeviceModelFullType>(
  "security",
  DevicesSchema
);
