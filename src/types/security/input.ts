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

export class InputDeviceType {
  constructor(
    public deviceId: string,
    public ip: string,
    public lastActiveDate: string,
    public title: string
  ) {}
}

export class UpdateDeviceType {
  constructor(
    public expirationDate: string,
    public lastActiveDate: string,
    public userId: string,
    public deviceId: string
  ) {}
}

export class CheckUserAndDeviceIdType {
  constructor(
    public deviceId: string,
    public userId: string
  ) {}
}
