import { injectable } from "inversify";
import { DevicesModel } from "../../domain/entities/security-entity";
import { DeviceDocumentType } from "../../../types/security/security-entities";
import { DeviceIdAndUserIdDataType } from "../../../types/security/security-dto";

@injectable()
export class SecurityRepository {
  async save(model: DeviceDocumentType) {
    return await model.save();
  }

  async terminateAllDevicesByUserIdExcludeCurrent(
    userAndDeviceId: DeviceIdAndUserIdDataType
  ): Promise<boolean> {
    const savedDevice = await DevicesModel.findOne({
      userId: userAndDeviceId.userId,
      deviceId: userAndDeviceId.deviceId,
    });
    const result = await DevicesModel.deleteMany({
      userId: userAndDeviceId.userId,
      deviceId: { $ne: savedDevice!.deviceId },
    });
    return result.acknowledged === true;
  }

  async terminateDeviceByDeviceId(deviceId: string): Promise<boolean> {
    try {
      const result = await DevicesModel.deleteOne({
        deviceId: deviceId,
      });
      return !!result.deletedCount;
    } catch (e) {
      console.log("not deleted device by deviceId", e);
      return false;
    }
  }

  async getDeviceByDeviceId(
    deviceId: string
  ): Promise<DeviceDocumentType | null> {
    const device = await DevicesModel.findOne({
      deviceId: deviceId,
    });

    if (!device) {
      return null;
    }
    return device;
  }
}
