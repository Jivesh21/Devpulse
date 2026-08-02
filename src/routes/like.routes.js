import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  toggleLike,
  getLikeCount,
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

// Toggle Like / Unlike
router.post(
  "/:postId",
  verifyJWT,
  toggleLike
);

export default router;