import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  toggleLike,
  getLikeCount,
  getLikeStatus,
  getLikedUsers,
} from "../controllers/like.controller.js";

const router = Router();

// ====================================
// Public Routes
// ====================================

// Get Like Count
router.get("/:postId/count", getLikeCount);

// Get Users Who Liked
router.get("/:postId/users", getLikedUsers);

// ====================================
// Protected Routes
// ====================================

// Check Like Status
router.get(
  "/:postId/status",
  verifyJWT,
  getLikeStatus
);

// Toggle Like / Unlike
router.post(
  "/:postId",
  verifyJWT,
  toggleLike
);

export default router;