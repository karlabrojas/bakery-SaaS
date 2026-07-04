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

  static async create(req: Request, res: Response) {
    try {
      const { name, description, price, category } = req.body;
      
      const product = await ProductService.create({
        name,
        description,
        price,
        category,
      });

      return res.status(201).json({
        success: true,
        data: product,
      });
    } catch (error: any) {
      if (error.message === "Ya existe un producto con ese nombre") {
        return res.status(409).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        error,
      });
    }
  }
}
