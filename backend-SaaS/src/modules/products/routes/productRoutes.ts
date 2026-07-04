import { Router } from "express";
import { ProductController } from "../controllers/productController";

const router = Router();

router.get("/", ProductController.getAll);
router.post("/", ProductController.create);

export default router;
