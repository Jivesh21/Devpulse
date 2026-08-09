import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { postSchema } from "../validators/post.validator.js";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getUserPosts,
   toggleLikePost,
} from "../controllers/post.controller.js";

const router = Router();

// ====================================
// Public Routes
// ====================================

// Get Feed
router.get("/", getAllPosts);

// Get User Posts
router.get("/user/:username", getUserPosts);

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
  validate(postSchema),
  createPost
);

// Update Post
router.patch(
  "/:postId",
  verifyJWT,
  upload.single("image"),
  validate(postSchema),
  updatePost
);

// Delete Post
router.delete(
  "/:postId",
  verifyJWT,
  deletePost
);
// ====================================
// Like / Unlike Post
// ====================================

router.post(
  "/:postId/like",
  verifyJWT,
  toggleLikePost
);

export default router;