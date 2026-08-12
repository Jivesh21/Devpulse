import { Router } from "express";

import {
  createOrGetConversation,
  getUserConversations,
  getConversation,
} from "../controllers/conversation.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// ====================================
// Conversation Routes
// ====================================

// Create or get direct conversation
router.post(
  "/",
  verifyJWT,
  createOrGetConversation
);

// Get current user's conversations
router.get(
  "/",
  verifyJWT,
  getUserConversations
);

// Get single conversation
router.get(
  "/:conversationId",
  verifyJWT,
  getConversation
);

export default router;