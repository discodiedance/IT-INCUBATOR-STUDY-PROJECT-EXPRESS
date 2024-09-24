export class InputCreateDeviceDataType {
  constructor(
    public deviceId: string,
    public ip: string,
    public lastActiveDate: string,
    public title: string,
    public userId: string,
    public expirationDate: string
  ) {}
}
