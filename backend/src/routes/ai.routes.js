import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";

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
  validate(aiChatSchema),
  chatWithAI
);

export default router;