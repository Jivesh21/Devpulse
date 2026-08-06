import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { updateProfileSchema } from "../validators/user.validator.js";

import {
  updateProfile,
  getUserProfile,
  getCurrentUser,
  getSuggestedDevelopers,
  searchUsers,
  updateAvatar,
  updateCoverImage,
} from "../controllers/user.controller.js";

const router = Router();

// ====================================
// Protected Routes
// ====================================

// Current User
router.get(
  "/current-user",
  verifyJWT,
  getCurrentUser
);

// Update Profile
router.patch(
  "/profile",
  verifyJWT,
  validate(updateProfileSchema),
  updateProfile
);
router.get(
  "/suggested",
  verifyJWT,
  getSuggestedDevelopers
);

// Update Avatar
router.patch(
  "/avatar",
  verifyJWT,
  upload.single("avatar"),
  updateAvatar
);

// Update Cover Image
router.patch(
  "/cover-image",
  verifyJWT,
  upload.single("coverImage"),
  updateCoverImage
);

// ====================================
// Public Routes
// ====================================

// Search Users
router.get(
  "/search",
  searchUsers
);

// Public Profile
router.get(
  "/:username",
  getUserProfile
);

export default router;