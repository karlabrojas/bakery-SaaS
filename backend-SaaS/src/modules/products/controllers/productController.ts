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

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, price, category } = req.body;

      if (Array.isArray(id)) {
        return res.status(400).json({
          success: false,
          message: "El id no es válido",
        });
      }

      const product = await ProductService.update(id, {
        name,
        description,
        price,
        category,
      });

      return res.status(200).json({
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

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "El id no es válido",
      });
    }

      const result = await ProductService.delete(id);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error,
      });
    }
  }

}
