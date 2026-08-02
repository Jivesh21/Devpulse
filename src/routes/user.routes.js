import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  updateProfile,
  getUserProfile,
  updateAvatar,
} from "../controllers/user.controller.js";

const router = Router();

// Protected Routes
router.patch("/profile", verifyJWT, updateProfile);

router.patch(
  "/avatar",
  verifyJWT,
  upload.single("avatar"), // ✅ Back to single
  updateAvatar
);

// Public Route
router.get("/:username", getUserProfile);

export default router;