import { Router } from "express";

import {
  getTrendingHashtags,
  getCommunityAnalytics,
} from "../controllers/analytics.controller.js";

const router = Router();

// ====================================
// Analytics
// ====================================

router.get(
  "/trending-hashtags",
  getTrendingHashtags
);
router.get(
  "/community",
  getCommunityAnalytics
);

export default router;