import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export class jwtService {
  static async createJWT(userId: string) {
    const accessToken = jwt.sign({ userId }, JWT_SECRET, {
      expiresIn: "1h",
    });
    return accessToken;
  }

  static async getUserIdByToken(accessToken: string) {
    try {
      const result: any = jwt.verify(accessToken, JWT_SECRET);
      return result.userId;
    } catch (error) {
      return null;
    }
  }
}
