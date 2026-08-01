import { Router } from "express";
import { DashboardController } from "../controllers/dashboardController";
import { authenticate } from "../../../middleware/auth.middleware";

const router = Router();

router.get(
  "/",

  authenticate,

  DashboardController.getDashboard,
);

export default router;
