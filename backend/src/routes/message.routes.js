import { Router } from "express";

import {
  sendMessage,
  getConversationMessages,
  markConversationAsRead,
} from "../controllers/message.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// ====================================
// Message Routes
// ====================================

// Send message
router.post(
  "/",
  verifyJWT,
  sendMessage
);

// Get conversation messages
router.get(
  "/:conversationId",
  verifyJWT,
  getConversationMessages
);

// Mark conversation as read
router.patch(
  "/:conversationId/read",
  verifyJWT,
  markConversationAsRead
);

export default router;