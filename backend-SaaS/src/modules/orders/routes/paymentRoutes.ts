import { Router } from "express";
import { authenticate } from "../../../middleware/auth.middleware";
import { PaymentController } from "../controllers/paymentController";
import { AuthenticatedRequest } from "../../../types/authenticated-request";

const router = Router({ mergeParams: true });

router.use(authenticate);

router.post("/advance", (req, res) =>
  PaymentController.registerAdvance(req as AuthenticatedRequest<any>, res),
);
router.get("/advances", (req, res) =>
  PaymentController.getAdvances(req as AuthenticatedRequest<any>, res),
);
router.get("/summary", (req, res) =>
  PaymentController.summary(req as AuthenticatedRequest<any>, res),
);
router.post("/final", (req, res) =>
  PaymentController.payRemaining(req as AuthenticatedRequest<any>, res),
);

export default router;
