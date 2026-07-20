import { Request, Response } from "express";
import { SaleService } from "../services/saleService";

export class SaleController {
  static async getAll(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res
          .status(401)
          .json({ success: false, message: "No autorizado" });
      }

      const sales = await SaleService.getAllByBakery(req.user.bakeryId);

      return res.status(200).json({
        success: true,
        data: sales,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "No autorizado",
        });
      }

      const sale = await SaleService.create({
        ...req.body,
        bakeryId: req.user.bakeryId,
      });
      console.log("BakeryId desde JWT:", req.user.bakeryId);
      return res.status(201).json({
        success: true,
        data: sale,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error,
      });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const saleId = req.params.id as string;
      const bakeryId = req.user!.bakeryId; 

      const sale = await SaleService.update(saleId, req.body, bakeryId);

      return res.status(200).json({
        success: true,
        data: sale,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error,
      });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const saleId = req.params.id as string;

      await SaleService.delete(saleId);

      return res.status(200).json({
        success: true,
        message: "Venta eliminada correctamente",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error,
      });
    }
  }
}
