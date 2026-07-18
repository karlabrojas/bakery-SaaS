import { Request, Response } from "express";
import { OrderService } from "../services/orderService";

export class OrderController {

    static async getAll(req: Request, res: Response) {
        try {
            const orders = await OrderService.getAll(req.user!.bakeryId);
            return res.status(200).json({ success: true, data: orders });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getById(req: Request, res: Response) {
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

    static async create(req: Request, res: Response) {
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

    static async update(req: Request, res: Response) {
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

    static async delete(req: Request, res: Response) {
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
}