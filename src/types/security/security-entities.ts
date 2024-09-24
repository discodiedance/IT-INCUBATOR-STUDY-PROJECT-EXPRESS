import { Model, HydratedDocument } from "mongoose";
import { CreateDeviceDataType, DeviceDBType } from "./security-dto";

export type DeviceDBMethodsType = {
  updateDevice: (expirationDate: string, lastActiveDate: string) => void;
};

type DeviceModelWithMethodsType = Model<DeviceDBType, {}, DeviceDBMethodsType>;

type DeviceModelStaticType = Model<DeviceDBType> & {
  createDevice(newDevice: CreateDeviceDataType): DeviceDocumentType;
};

export type DeviceModelFullType = DeviceModelWithMethodsType &
  DeviceModelStaticType;

export type DeviceDocumentType = HydratedDocument<
  DeviceDBType,
  DeviceDBMethodsType
>;
