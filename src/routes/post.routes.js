import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  updateProfile,
  getUserProfile,
  updateAvatar,
  updateCoverImage,
} from "../controllers/user.controller.js";
import { getUserPosts } from "../controllers/post.controller.js";

const router = Router();

// ====================================
// Protected Routes
// ====================================
router.patch("/profile", verifyJWT, updateProfile);

router.patch(
  "/avatar",
  verifyJWT,
  upload.single("avatar"),
  updateAvatar
);

router.patch(
  "/cover-image",
  verifyJWT,
  upload.single("coverImage"),
  updateCoverImage
);

// ====================================
// Public Routes
// ====================================
router.get("/:username/posts", getUserPosts);
router.get("/:username", getUserProfile);

export default router;