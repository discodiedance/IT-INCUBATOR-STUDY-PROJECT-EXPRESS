import { Request, Response } from "express";

import { QuerySecurityRepostiory } from "../repositories/query-repository/query-security-repository";

import { JwtService } from "../aplication/jwt-service";
import { SecurityService } from "../domain/security-service";

import { RequestWithParams, Params } from "../types/common";
import { DeviceDBType } from "../types/security/input";
import { OutputDeviceType } from "../types/security/output";

export class SecurityController {
  constructor(
    protected SecurityService: SecurityService,
    protected JwtService: JwtService,
    protected QuerySecurityRepostiory: QuerySecurityRepostiory
  ) {}
  async getallDevices(req: Request, res: Response) {
    const userId: string = await this.JwtService.getUserIdByRefreshToken(
      req.cookies.refreshToken
    );
    const devices: OutputDeviceType[] | null =
      await this.QuerySecurityRepostiory.getAllDevicesByUserId(userId);
    return res.status(200).send(devices);
  }
  async terminateAllSessionsExcludeCurrent(req: Request, res: Response) {
    const status: boolean | null =
      await this.SecurityService.terminateAllDevicesByUserIdExcludeCurrent(
        req.cookies.refreshToken
      );

    if (!status) {
      res.sendStatus(401);
      return;
    }
    return res.sendStatus(204);
  }
  async terminateSessionById(req: RequestWithParams<Params>, res: Response) {
    const device: DeviceDBType | null =
      await this.QuerySecurityRepostiory.getDeviceByDeviceId(req.params.id);

    if (!device) {
      res.sendStatus(404);
      return;
    }
    const status: boolean | null =
      await this.SecurityService.terminateDeviceByDeviceId(
        device.deviceId,
        req.cookies.refreshToken
      );

    if (!status) {
      res.sendStatus(403);
      return;
    }

    res.sendStatus(204);
    return;
  }
}
