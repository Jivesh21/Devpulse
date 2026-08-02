import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleLike } from "../controllers/like.controller.js";

const router = Router();

// ====================================
// Toggle Like / Unlike
// ====================================
router.post(
  "/:postId",
  verifyJWT,
  toggleLike
);

export default router;