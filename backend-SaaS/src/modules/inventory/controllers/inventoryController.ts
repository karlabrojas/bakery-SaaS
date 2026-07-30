import { Request, Response } from "express";
import { InventoryService } from "../services/inventoryService";

export class InventoryController {
    static async getAll(req: Request, res: Response) {
        try {
            const data = await InventoryService.getAll(req.user!.bakeryId);
            return res.status(200).json({ success: true, data });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const { name, quantity, unit, minimum_stock } = req.body; 

            if (!name || quantity === undefined || !unit) {
                return res.status(400).json({ success: false, message: "Nombre, cantidad y unidad son obligatorios" });
            }

            if (quantity < 0) {
                return res.status(400).json({ success: false, message: "La cantidad no puede ser negativa" });
            }

            const data = await InventoryService.create(req.user!.bakeryId, { name, quantity, unit, minimum_stock }); 
            return res.status(201).json({ success: true, data });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, quantity, unit, minimum_stock } = req.body; 

            if (quantity !== undefined && quantity < 0) {
                return res.status(400).json({ success: false, message: "La cantidad no puede ser negativa" });
            }

            const data = await InventoryService.update(id as string, req.user!.bakeryId, { name, quantity, unit, minimum_stock }); 
            return res.status(200).json({ success: true, data });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await InventoryService.delete(id as string, req.user!.bakeryId);
            return res.status(200).json({ success: true, data: result });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}