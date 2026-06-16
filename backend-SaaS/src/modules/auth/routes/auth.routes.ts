import { Router } from "express";

import { AuthController } from "../controllers/auth.controller";

import { authenticate } from "../../../middleware/auth.middleware";

const router = Router();

const controller = new AuthController();

router.post("/register", controller.register.bind(controller));

router.post("/login", controller.login.bind(controller));

router.post("/refresh", controller.refresh.bind(controller));

router.post("/logout", authenticate, controller.logout.bind(controller));

export default router;
