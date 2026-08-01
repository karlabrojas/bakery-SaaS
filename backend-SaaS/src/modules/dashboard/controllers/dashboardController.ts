import { Request, Response } from "express";
import { DashboardService } from "../services/dashboardService";

export class DashboardController {
  static async getDashboard(
    req: Request,

    res: Response,
  ) {
    try {
      const bakeryId = req.user!.bakeryId;

      const dashboard = await DashboardService.getDashboard(bakeryId);

      return res.status(200).json(dashboard);
    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
}
