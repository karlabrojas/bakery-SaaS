import jwt from "jsonwebtoken";
import { JwtPayload } from "../../../types/jwt-payload";

export class TokenService {
  generateAccessToken(payload: JwtPayload) {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
      expiresIn: "15m",
    });
  }

  generateRefreshToken(payload: JwtPayload) {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: "7d",
    });
  }

  verifyRefreshToken(token: string) {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as JwtPayload;
  }
}
