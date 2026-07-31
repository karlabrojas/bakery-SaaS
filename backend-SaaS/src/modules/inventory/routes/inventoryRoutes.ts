import { Router } from "express";
import { InventoryController } from "../controllers/inventoryController";
import { authenticate } from "../../../middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, InventoryController.getAll);
router.post("/", authenticate, InventoryController.create);
router.put("/:id", authenticate, InventoryController.update);
router.delete("/:id", authenticate, InventoryController.delete);

router.post("/movements", authenticate, InventoryController.createMovement);
router.get("/movements", authenticate, InventoryController.getMovements);

router.post("/movements/salida", authenticate, InventoryController.createSalida);

router.get("/:id", authenticate, InventoryController.getById);

router.post("/movements/ajuste", authenticate, InventoryController.createAjuste);
export default router;