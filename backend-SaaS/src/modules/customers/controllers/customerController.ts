import { Request, Response } from "express";
import { CustomerService } from "../services/customerService";

export class CustomerController {
    static async getAll(req: Request, res: Response) {
        try {
            const customers = await CustomerService.getAll(req.user!.bakeryId);
            return res.status(200).json({ success: true, data: customers });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const customer = await CustomerService.create(req.user!.bakeryId, req.body);
            return res.status(201).json({ success: true, data: customer });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}