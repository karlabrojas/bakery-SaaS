import { Response } from "express";
import { AuthenticatedRequest } from "../types/authenticated-request";

export abstract class BaseController {
  protected static getAuthData(req: AuthenticatedRequest) {
    return {
      userId: req.user.userId,
      bakeryId: req.user.bakeryId,
      role: req.user.role,
      sessionId: req.user.sessionId,
    };
  }

  protected static getParam(req: AuthenticatedRequest, name: string): string {
    const value = req.params[name];

    if (!value) {
      throw new Error(`El parámetro '${name}' es obligatorio.`);
    }

    if (Array.isArray(value)) {
      return value[0];
    }

    return value;
  }

  protected static ok(res: Response, data: unknown): void {
    res.status(200).json(data);
  }

  protected static created(res: Response, data: unknown): void {
    res.status(201).json(data);
  }

  protected static error(res: Response, error: unknown): void {
    const message =
      error instanceof Error ? error.message : "Error interno del servidor";

    res.status(400).json({
      success: false,
      message,
    });
  }
}
