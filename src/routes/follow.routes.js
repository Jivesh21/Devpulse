import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  toggleFollow,
  getFollowersCount,
  getFollowingCount,
  getFollowStatus,
} from "../controllers/follow.controller.js";

const router = Router();

// ====================================
// Public Routes
// ====================================

// Followers Count
router.get(
  "/:userId/followers/count",
  getFollowersCount
);

// Following Count
router.get(
  "/:userId/following/count",
  getFollowingCount
);

// ====================================
// Protected Routes
// ====================================

// Follow Status
router.get(
  "/:userId/status",
  verifyJWT,
  getFollowStatus
);

// Toggle Follow
router.post(
  "/:userId",
  verifyJWT,
  toggleFollow
);

export default router;