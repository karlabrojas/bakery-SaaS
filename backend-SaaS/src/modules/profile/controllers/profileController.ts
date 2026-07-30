import { Request, Response } from "express";
import { ProfileService } from "../services/profileService";

export class ProfileController {
  static async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          message: "Usuario no autenticado.",
        });
      }

      const profile = await ProfileService.getProfile(userId);

      return res.status(200).json(profile);
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Error al obtener el perfil.",
      });
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          message: "Usuario no autenticado.",
        });
      }

      const user = await ProfileService.updateUser(userId, req.body);

      return res.status(200).json({
        message: "Usuario actualizado correctamente.",
        user,
      });
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Error al actualizar el usuario.",
      });
    }
  }

  static async updateBakery(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          message: "Usuario no autenticado.",
        });
      }

      const bakery = await ProfileService.updateBakery(userId, req.body);

      return res.status(200).json({
        message: "Panadería actualizada correctamente.",
        bakery,
      });
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Error al actualizar la panadería.",
      });
    }
  }

  static async updateLogo(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          message: "Usuario no autenticado.",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: "Debe enviar un archivo.",
        });
      }

      const bakery = await ProfileService.updateLogo(userId, req.file);

      return res.status(200).json({
        message: "Logo actualizado correctamente.",
        bakery,
      });
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Error al actualizar el logo.",
      });
    }
  }
}
