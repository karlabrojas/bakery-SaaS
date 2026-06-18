import { Request, Response } from "express";
import { SaleService } from "../services/saleService";

export class SaleController {
  static async getAll(req: Request, res: Response) {
    try {
      const sales = await SaleService.getAll();

      return res.status(200).json({
        success: true,
        data: sales,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error,
      });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const sale = await SaleService.create(req.body);

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

      const sale = await SaleService.update(saleId, req.body);

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
