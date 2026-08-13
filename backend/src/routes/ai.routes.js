import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import aiRateLimiter from "../middlewares/aiRateLimiter.middleware.js";
import { checkAIUsage } from "../middlewares/aiUsage.middleware.js";

import {
  chatWithAI,
} from "../controllers/ai.controller.js";

import {
  aiChatSchema,
} from "../validators/ai.validator.js";

const router = Router();

// ====================================
// AI Chat
// ====================================

router.post(
  "/chat",
  verifyJWT,
  aiRateLimiter,
  validate(aiChatSchema),
  checkAIUsage,
  chatWithAI
);

export default router;