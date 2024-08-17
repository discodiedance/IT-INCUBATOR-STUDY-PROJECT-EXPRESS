export type DeviceDBType = {
  deviceId: string;
  ip: string;
  lastActiveDate: string;
  title: string;
  userId: string;
  expirationDate: string;
};

export type InputDeviceType = {
  deviceId: string;
  ip: string;
  lastActiveDate: string;
  title: string;
};

export type UpdateDeviceType = {
  expirationDate: string;
  lastActiveDate: string;
  userId: string;
  deviceId: string;
};

export type CheckUserAndDeviceIdType = {
  deviceId: string;
  userId: string;
};
