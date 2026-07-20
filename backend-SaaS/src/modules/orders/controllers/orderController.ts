import { Response } from "express";
import { OrderService } from "../services/orderService";
import { BaseController } from "../../../controllers/BaseController"; // Asumiendo tu ruta base
import { AuthenticatedRequest } from "../../../types/authenticated-request";

export class OrderController extends BaseController {
  static async getAll(req: AuthenticatedRequest, res: Response) {
    try {
      const { bakeryId } = req.user!;
      const orders = await OrderService.getAll(bakeryId);
      return res.status(200).json({ success: true, data: orders });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getById(req: AuthenticatedRequest, res: Response) {
    try {
      const pedido = await OrderService.getById(
        req.params.id as string,
        req.user!.bakeryId,
      );
      return res.status(200).json({ success: true, data: pedido });
    } catch (error: any) {
      return res.status(404).json({ success: false, message: error.message });
    }
  }

  static async create(req: AuthenticatedRequest, res: Response) {
    try {
      const pedido = await OrderService.create(
        req.body,
        req.user!.bakeryId,
        req.user!.userId,
      );
      return res.status(201).json({ success: true, data: pedido });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async update(req: AuthenticatedRequest, res: Response) {
    try {
      const pedido = await OrderService.update(
        req.params.id as string,
        req.body,
        req.user!.bakeryId,
      );
      return res.status(200).json({ success: true, data: pedido });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response) {
    try {
      const resultado = await OrderService.delete(
        req.params.id as string,
        req.user!.bakeryId,
      );
      return res.status(200).json({ success: true, data: resultado });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async changeStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const pedido = await OrderService.changeStatus(
        req.params.id as string,
        req.body,
        req.user!.bakeryId,
        req.user!.userId,
      );
      return res.status(200).json({ success: true, data: pedido });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getHistory(req: AuthenticatedRequest, res: Response) {
    try {
      const historial = await OrderService.getHistory(
        req.params.id as string,
        req.user!.bakeryId,
      );
      return res.status(200).json({ success: true, data: historial });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async convertToSale(req: AuthenticatedRequest, res: Response) {
    try {
      const venta = await OrderService.convertToSale(
        req.params.id as string,
        req.user!.bakeryId,
        req.user!.userId,
      );
      return res.status(201).json({ success: true, data: venta });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}
