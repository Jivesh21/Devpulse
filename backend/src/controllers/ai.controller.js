import asyncHandler from "../utils/asyncHandler.js";
import { generateAIResponse } from "../services/ai.service.js";

// ====================================
// Generate AI Chat Response
// ====================================

export const chatWithAI = asyncHandler(async (req, res) => {
  const { message } = req.body;

  const response = await generateAIResponse(message);

  return res.status(200).json({
    success: true,
    message: "AI response generated successfully",
    data: {
      response,
    },
  });
});