import { Request, Response } from "express";
import { SaleService } from "../services/saleService";

export class SaleController {
  static async getAll(req: Request, res: Response) {
    const sales = await SaleService.getAll();

    return res.status(200).json({
      success: true,
      data: sales,
    });
  }

  static async create(req: Request, res: Response) {
    const sale = await SaleService.create(req.body);

    return res.status(201).json({
      success: true,
      data: sale,
    });
  }
}