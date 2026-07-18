import { Router } from "express";
import { CustomerController } from "../controllers/customerController";
import { authenticate } from "../../../middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, CustomerController.getAll);
router.post("/", authenticate, CustomerController.create);

export default router;