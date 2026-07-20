import { Router } from "express";
import { OrderController } from "../controllers/orderController";
import { authenticate } from "../../../middleware/auth.middleware";
import { AuthenticatedRequest } from "../../../types/authenticated-request";

const router = Router();

router.use(authenticate);

router.get("/", (req, res) =>
  OrderController.getAll(req as AuthenticatedRequest, res),
);
router.get("/:id", (req, res) =>
  OrderController.getById(req as AuthenticatedRequest, res),
);
router.post("/", (req, res) =>
  OrderController.create(req as AuthenticatedRequest, res),
);
router.put("/:id", (req, res) =>
  OrderController.update(req as AuthenticatedRequest, res),
);
router.delete("/:id", (req, res) =>
  OrderController.delete(req as AuthenticatedRequest, res),
);

router.patch("/:id/status", (req, res) =>
  OrderController.changeStatus(req as AuthenticatedRequest, res),
);
router.get("/:id/history", (req, res) =>
  OrderController.getHistory(req as AuthenticatedRequest, res),
);
router.post("/:id/convert-sale", (req, res) =>
  OrderController.convertToSale(req as AuthenticatedRequest, res),
);

export default router;
