import { Request, Response } from "express";

import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export class AuthController {
  /** Registro */
  async register(req: Request, res: Response) {
    try {
      const result = await authService.register(req.body, {
        ip: req.ip!,
        userAgent: req.headers["user-agent"] || "",
      });

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,

        secure: process.env.NODE_ENV === "production",

        sameSite: "strict",

        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(201).json({
        bakery: result.bakery,

        user: result.user,

        accessToken: result.accessToken,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }
  /** Inicio de sesión */
  async login(req: Request, res: Response) {
    try {
      const result = await authService.login(
        {
          email: req.body.email,
          password: req.body.password,
        },
        {
          ip: req.ip || "",
          userAgent: req.headers["user-agent"] || "",
        },
      );

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        accessToken: result.accessToken,
      });
    } catch (error: any) {
      console.error(error);

      return res.status(401).json({
        message: error.message,
      });
    }
  }
  /** Refresh token */
  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token requerido",
      });
    }

    const result = await authService.refresh(refreshToken);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      accessToken: result.accessToken,
    });
  }

  /** Cerrar sesión */
  async logout(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "No autorizado",
        });
      }

      await authService.logout(req.user.userId, req.user.sessionId);

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      return res.sendStatus(204);
    } catch (error) {
      return res.status(500).json({
        message: "Error al cerrar sesión",
      });
    }
  }
}
