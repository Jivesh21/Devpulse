import { z } from "zod";

// ====================================
// AI Chat Validation
// ====================================

export const aiChatSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(10000, "Message cannot exceed 10,000 characters"),
});