import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/post.controller.js";

const router = Router();

// ====================================
// Public Routes
// ====================================

// Get Feed
router.get("/", getAllPosts);

// Get Single Post
router.get("/:postId", getPostById);

// ====================================
// Protected Routes
// ====================================

// Create Post
router.post(
  "/",
  verifyJWT,
  upload.single("image"),
  createPost
);

// Update Post
router.patch(
  "/:postId",
  verifyJWT,
  upload.single("image"),
  updatePost
);

// Delete Post
router.delete(
  "/:postId",
  verifyJWT,
  deletePost
);

export default router;