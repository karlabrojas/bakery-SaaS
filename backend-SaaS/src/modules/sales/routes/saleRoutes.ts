import { Router } from "express";
import { SaleController } from "../controllers/saleController";

const router = Router();

router.get("/", SaleController.getAll);

router.post("/", SaleController.create);

router.put("/:id", SaleController.update);

router.delete("/:id", SaleController.delete);

export default router;
