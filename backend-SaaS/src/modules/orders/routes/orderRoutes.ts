import { Router } from "express";
import { OrderController } from "../controllers/orderController";
import { authenticate } from "../../../middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, OrderController.getAll);
router.get("/:id", authenticate, OrderController.getById);
router.post("/", authenticate, OrderController.create);
router.put("/:id", authenticate, OrderController.update);
router.delete("/:id", authenticate, OrderController.delete);
router.patch("/:id/status", authenticate, OrderController.changeStatus);

export default router;