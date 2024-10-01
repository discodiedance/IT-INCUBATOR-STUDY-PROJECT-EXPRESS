import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { SecurityService } from "../features/application/services/security-service";
import { RequestWithParams, Params } from "../types/common";
import { JwtService } from "../features/application/services/jwt-service";
import { QuerySecurityRepository } from "../features/infrastructure/repositories/query-repository/query-security-repository";
import { SecurityRepository } from "../features/infrastructure/repositories/security-repository";

@injectable()
export class SecurityController {
  constructor(
    @inject(SecurityRepository)
    protected SecurityRepository: SecurityRepository,
    @inject(SecurityService) protected SecurityService: SecurityService,
    @inject(JwtService) protected JwtService: JwtService,
    @inject(QuerySecurityRepository)
    protected QuerySecurityRepostiory: QuerySecurityRepository
  ) {}

  async getallDevices(req: Request, res: Response) {
    const userId = await this.JwtService.getUserIdByRefreshToken(
      req.cookies.refreshToken
    );
    const devices =
      await this.QuerySecurityRepostiory.getAllDevicesByUserId(userId);
    res.status(200).send(devices);
    return;
  }

  async terminateAllSessionsExcludeCurrent(req: Request, res: Response) {
    const status =
      await this.SecurityService.terminateAllDevicesByUserIdExcludeCurrent(
        req.cookies.refreshToken
      );

    if (!status) {
      res.sendStatus(401);
      return;
    }
    res.sendStatus(204);
    return;
  }

  async terminateSessionById(req: RequestWithParams<Params>, res: Response) {
    const device = await this.SecurityRepository.getDeviceByDeviceId(
      req.params.id
    );

    if (!device) {
      res.sendStatus(404);
      return;
    }
    const status = await this.SecurityService.terminateDeviceByDeviceId(
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
