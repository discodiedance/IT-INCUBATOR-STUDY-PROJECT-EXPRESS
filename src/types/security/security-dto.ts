export class DeviceDBType {
  constructor(
    public deviceId: string,
    public ip: string,
    public lastActiveDate: string,
    public title: string,
    public userId: string,
    public expirationDate: string
  ) {}
}

export class CreateDeviceDataType {
  constructor(
    public deviceId: string,
    public ip: string,
    public lastActiveDate: string,
    public title: string,
    public userId: string,
    public expirationDate: string
  ) {}
}

export class DeviceIdAndUserIdDataType {
  constructor(
    public deviceId: string,
    public userId: string
  ) {}
}
