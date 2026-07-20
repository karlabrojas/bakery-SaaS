import { Router } from "express";
import { authenticate } from "../../../middleware/auth.middleware";
import { DeliveryController } from "../controllers/deliveryController";
import { AuthenticatedRequest } from "../../../types/authenticated-request";

const router = Router({ mergeParams: true });

router.use(authenticate);

router.post("/", (req, res) =>
  DeliveryController.create(req as AuthenticatedRequest<any>, res),
);
router.get("/", (req, res) =>
  DeliveryController.get(req as AuthenticatedRequest<any>, res),
);
router.put("/", (req, res) =>
  DeliveryController.update(req as AuthenticatedRequest<any>, res),
);
router.delete("/", (req, res) =>
  DeliveryController.delete(req as AuthenticatedRequest<any>, res),
);

router.patch("/status", (req, res) =>
  DeliveryController.changeStatus(req as AuthenticatedRequest<any>, res),
);
router.patch("/complete", (req, res) =>
  DeliveryController.complete(req as AuthenticatedRequest<any>, res),
);

export default router;
