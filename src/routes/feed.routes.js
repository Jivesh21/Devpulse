import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getFeed } from "../controllers/feed.controller.js";

const router = Router();

// ====================================
// Get User Feed
// ====================================
router.get(
  "/",
  verifyJWT,
  getFeed
);

export default router;