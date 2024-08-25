import jwt from "jsonwebtoken";
import { JWT_SECRET, REFRESH_SECRET } from "../config";

export class jwtService {
  static async createJWT(userId: string): Promise<string> {
    const accessToken = jwt.sign({ userId }, JWT_SECRET, {
      expiresIn: "10s",
    });
    return accessToken;
  }

  static async createRefreshJWT(
    deviceId: string,
    userId: string
  ): Promise<string> {
    const refreshToken = jwt.sign({ deviceId, userId }, REFRESH_SECRET, {
      expiresIn: "20s",
    });
    return refreshToken;
  }

  static async getUserIdByJWTToken(accessToken: string) {
    try {
      const result: any = jwt.verify(accessToken, JWT_SECRET);
      return result.userId;
    } catch (error) {
      return null;
    }
  }

  static async getUserIdByRefreshToken(refreshToken: string) {
    try {
      const result: any = jwt.verify(refreshToken, REFRESH_SECRET);
      return result.userId;
    } catch (error) {
      return null;
    }
  }

  static async getDeviceIdByRefreshToken(refreshToken: string) {
    try {
      const result: any = jwt.verify(refreshToken, REFRESH_SECRET);
      return result.deviceId;
    } catch (error) {
      return null;
    }
  }

  static async getExpirationDateFromRefreshToken(
    refreshToken: string
  ): Promise<string> {
    const decodedToken: any = jwt.decode(refreshToken);
    const exp = new Date(decodedToken.exp * 1000).toISOString();
    return exp;
  }

  static async getIssuedAtFromJWTAccessToken(
    accessToken: string
  ): Promise<string> {
    const decodedToken: any = jwt.decode(accessToken);
    const iat = new Date(decodedToken.iat * 1000).toISOString();
    return iat;
  }

  static async validateRefreshToken(token: string) {
    try {
      const decodedToken: any = jwt.verify(token, REFRESH_SECRET);
      const deviceId = decodedToken.deviceId;
      const userId = decodedToken.userId.toString();
      const iat = new Date(decodedToken.iat * 1000).toISOString();
      const exp = new Date(decodedToken.exp * 1000).toISOString();
      return { deviceId, userId, iat, exp };
    } catch (e) {
      return null;
    }
  }
}
