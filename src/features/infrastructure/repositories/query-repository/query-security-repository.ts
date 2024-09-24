import { injectable } from "inversify";

import { DeviceDocumentType } from "../../../../types/security/security-entities";
import { OutputDeviceType } from "../../../../types/security/output";
import { DevicesModel } from "../../../domain/entities/security-entity";
import { securityMapper } from "../../../application/mappers/security/security-mapper";

@injectable()
export class QuerySecurityRepository {
  async getAllDevicesByUserId(
    userId: string
  ): Promise<OutputDeviceType[] | null> {
    const allDevices: DeviceDocumentType[] | null = await DevicesModel.find({
      userId: userId,
    });
    if (!allDevices) {
      return null;
    }
    return securityMapper(allDevices);
  }
}
