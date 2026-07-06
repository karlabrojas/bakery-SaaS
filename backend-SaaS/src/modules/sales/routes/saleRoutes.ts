import { Router } from "express";
import { SaleController } from "../controllers/saleController";
import { authenticate } from "../../../middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, SaleController.getAll);
router.post("/", authenticate, SaleController.create);
router.put("/:id", authenticate, SaleController.update);
router.delete("/:id", authenticate, SaleController.delete);

export default router;
