import { Request, Response } from "express";
import { ProductService } from "../services/productService";

export class ProductController {
  static async getAll(req: Request, res: Response) {
    try {
      const products = await ProductService.getAll(req.user!.bakeryId);

      return res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const id = req.params.id as string;

      const product = await ProductService.getById(id, req.user!.bakeryId);

      return res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const product = await ProductService.create(
        req.user!.bakeryId,
        req.body,
        req.file,
      );

      return res.status(201).json({
        success: true,
        message: "Producto creado correctamente.",
        data: product,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = req.params.id as string;

      const product = await ProductService.update(
        id,
        req.user!.bakeryId,
        req.body,
        req.file,
      );

      return res.status(200).json({
        success: true,
        message: "Producto actualizado correctamente.",
        data: product,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = req.params.id as string;

      const response = await ProductService.delete(id, req.user!.bakeryId);

      return res.status(200).json({
        success: true,
        ...response,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}
