import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";

import { aiChatSchema } from "../validators/ai.validator.js";

import { chatWithAI } from "../controllers/ai.controller.js";

const router = Router();

// ====================================
// Protected AI Routes
// ====================================

// ====================================
// AI Chat
// ====================================

router.post(
  "/chat",
  verifyJWT,
  validate(aiChatSchema),
  chatWithAI
);

export default router;