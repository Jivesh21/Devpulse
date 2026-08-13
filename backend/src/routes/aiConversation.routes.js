import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  createAIConversation,
  getAIConversations,
  getAIConversation,
  deleteAIConversation,
} from "../controllers/aiConversation.controller.js";

const router = Router();

// ====================================
// Protected AI Conversation Routes
// ====================================

// ====================================
// Create Conversation
// ====================================

router.post(
  "/",
  verifyJWT,
  createAIConversation
);

// ====================================
// Get User Conversations
// ====================================

router.get(
  "/",
  verifyJWT,
  getAIConversations
);

// ====================================
// Get Single Conversation
// ====================================

router.get(
  "/:conversationId",
  verifyJWT,
  getAIConversation
);

// ====================================
// Delete Conversation
// ====================================

router.delete(
  "/:conversationId",
  verifyJWT,
  deleteAIConversation
);

export default router;