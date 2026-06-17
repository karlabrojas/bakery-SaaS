import { Request, Response } from "express";
import { ProductService } from "../services/productService";

export class ProductController {
  static async getAll(req: Request, res: Response) {
    try {
      const products = await ProductService.getAll();

      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json({
        message: "Error al obtener productos",
        error,
      });
    }
  }
}