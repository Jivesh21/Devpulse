import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  toggleLike,
  getLikeCount,
  getLikeStatus,
} from "../controllers/like.controller.js";

const router = Router();

// ====================================
// Public Routes
// ====================================

// Get Like Count
router.get("/:postId/count", getLikeCount);

// ====================================
// Protected Routes
// ====================================

// Check Like Status
router.get(
  "/:postId/status",
  verifyJWT,
  getLikeStatus
);

// Toggle Like
router.post(
  "/:postId",
  verifyJWT,
  toggleLike
);

export default router;