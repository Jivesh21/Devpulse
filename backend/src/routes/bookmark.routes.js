import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  toggleBookmark,
  getBookmarkedPosts,
  getBookmarkStatus,
} from "../controllers/bookmark.controller.js";

const router = Router();

// All bookmark routes require authentication
router.use(verifyJWT);

// Toggle Bookmark
router.post("/:postId", toggleBookmark);

// Get All Bookmarked Posts
router.get("/", getBookmarkedPosts);

// Check Bookmark Status
router.get("/:postId/status", getBookmarkStatus);

export default router;