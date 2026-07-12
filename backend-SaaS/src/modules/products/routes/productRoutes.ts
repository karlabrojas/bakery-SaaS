import { Router } from "express";
import { ProductController } from "../../products/controllers/productController";
import { authenticate } from "../../../middleware/auth.middleware";
import { upload } from "../../../middleware/upload";

const router = Router();
router.get("/", authenticate, ProductController.getAll);
router.get("/all", authenticate, ProductController.getAllIncluyendoInactivos); 


router.get("/:id", authenticate, ProductController.getById);
router.patch("/:id/activate", authenticate, ProductController.activarProducto); 
router.patch("/:id/deactivate", authenticate, ProductController.desactivarProducto);


router.post("/", authenticate, upload.single("image"), ProductController.create,);

router.put("/:id", authenticate, upload.single("image"), ProductController.update,);
router.delete("/:id", authenticate, ProductController.delete);
export default router;
