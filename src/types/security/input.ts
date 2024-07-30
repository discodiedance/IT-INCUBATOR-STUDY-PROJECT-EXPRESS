export type DeviceType = {
  deviceId: string;
  ip: string;
  lastActiveDate: string;
  title: string;
  userId: string;
  expirationDate: string;
};

export type UpdateDeviceType = {
  expirationDate: string;
  lastActiveDate: string;
  userId: string;
  deviceId: string;
};
