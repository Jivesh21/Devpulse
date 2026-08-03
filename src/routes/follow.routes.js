import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  toggleFollow,
  getFollowersCount,
  getFollowingCount,
  getFollowStatus,
  getFollowers,
  getFollowing,
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

// Followers List
router.get(
  "/:userId/followers",
  getFollowers
);

// Following Count
router.get(
  "/:userId/following/count",
  getFollowingCount
);

// Following List
router.get(
  "/:userId/following",
  getFollowing
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