import { z } from "zod";

// ====================================
// AI Chat Validation
// ====================================

export const aiChatSchema = z.object({
  conversationId: z
    .string()
    .min(1, "Conversation ID is required"),

  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(
      10000,
      "Message cannot exceed 10,000 characters"
    ),
});