import { Router } from "express";
import { ProfileController } from "../controllers/profileController";
import { authenticate } from "../../../middleware/auth.middleware";
import { upload } from "../../../middleware/upload";

const router = Router();

router.get("/", authenticate, ProfileController.getProfile);

router.patch("/user", authenticate, ProfileController.updateUser);

router.patch("/bakery", authenticate, ProfileController.updateBakery);

router.patch(
  "/logo",
  authenticate,
  upload.single("logo"),
  ProfileController.updateLogo,
);

export default router;
