import { Router } from "express";
import { SaleController } from "../controllers/saleController";

const router = Router();

router.get("/", SaleController.getAll);
router.post("/", SaleController.create);

export default router;