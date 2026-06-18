import { Request, Response } from "express";
import { ProductService } from "../services/productService";

export class ProductController {
  static async getAll(req: Request, res: Response) {
    try {
      const products = await ProductService.getAll();

      return res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error,
      });
    }
  }
}
