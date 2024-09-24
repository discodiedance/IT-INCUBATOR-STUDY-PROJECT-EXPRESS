import { injectable } from "inversify";
import jwt from "jsonwebtoken";
import { JWT_SECRET, REFRESH_SECRET } from "../../../config";

@injectable()
export class JwtService {
  async createJWT(userId: string): Promise<string> {
    const accessToken = jwt.sign({ userId }, JWT_SECRET, {
      expiresIn: "10m",
    });
    return accessToken;
  }

  async createRefreshJWT(deviceId: string, userId: string): Promise<string> {
    const refreshToken = jwt.sign({ deviceId, userId }, REFRESH_SECRET, {
      expiresIn: "20m",
    });

    return refreshToken;
  }

  async getUserIdByJWTToken(accessToken: string) {
    try {
      const result: any = jwt.verify(accessToken, JWT_SECRET);
      return result.userId;
    } catch (error) {
      return null;
    }
  }

  async getUserIdByRefreshToken(refreshToken: string) {
    try {
      const result: any = jwt.verify(refreshToken, REFRESH_SECRET);
      return result.userId;
    } catch (error) {
      return null;
    }
  }

  async getDeviceIdByRefreshToken(refreshToken: string) {
    try {
      const result: any = jwt.verify(refreshToken, REFRESH_SECRET);
      return result.deviceId;
    } catch (error) {
      return null;
    }
  }

  async getExpirationDateFromRefreshToken(
    refreshToken: string
  ): Promise<string> {
    const decodedToken: any = jwt.decode(refreshToken);
    const expirationDate = new Date(decodedToken.exp * 1000).toISOString();
    return expirationDate;
  }

  async getIssuedAtFromJWTAccessToken(accessToken: string): Promise<string> {
    const decodedToken: any = jwt.decode(accessToken);
    const issuedAt = new Date(decodedToken.iat * 1000).toISOString();
    return issuedAt;
  }

  async validateRefreshToken(token: string) {
    try {
      const decodedToken: any = jwt.verify(token, REFRESH_SECRET);
      const deviceId = decodedToken.deviceId;
      const userId = decodedToken.userId.toString();
      const issuedAt = new Date(decodedToken.iat * 1000).toISOString();
      const expirationDate = new Date(decodedToken.exp * 1000).toISOString();
      return { deviceId, userId, issuedAt, expirationDate };
    } catch (e) {
      return null;
    }
  }
}
