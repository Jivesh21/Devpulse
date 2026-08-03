import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createComment,
  getComments,
  updateComment,
  deleteComment,
  getCommentCount,
} from "../controllers/comment.controller.js";

const router = Router();

// ====================================
// Public Routes
// ====================================

// Get Comment Count
router.get("/:postId/count", getCommentCount);

// Get Comments of a Post
router.get("/:postId", getComments);

// ====================================
// Protected Routes
// ====================================

// Create Comment
router.post(
  "/:postId",
  verifyJWT,
  createComment
);

// Update Comment
router.patch(
  "/:commentId",
  verifyJWT,
  updateComment
);

// Delete Comment
router.delete(
  "/:commentId",
  verifyJWT,
  deleteComment
);

export default router;