import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

import AIConversation from "../models/aiConversation.model.js";

import {
  generateAIResponseStream,
} from "../services/ai.service.js";

// ====================================
// Generate AI Chat Response
// ====================================

export const chatWithAI = asyncHandler(
  async (req, res) => {
    const {
      conversationId,
      message,
    } = req.body;

    // ====================================
    // Verify Conversation Ownership
    // ====================================

    const conversation =
      await AIConversation.findOne({
        _id: conversationId,
        user: req.user._id,
      });

    if (!conversation) {
      throw new ApiError(
        404,
        "AI conversation not found"
      );
    }

    // ====================================
    // Save User Message
    // ====================================

    conversation.messages.push({
      role: "user",
      content: message,
    });

    await conversation.save();

    // ====================================
    // Build Conversation Context
    // ====================================

    // Keep only the latest 20 messages
    // to control Gemini token usage.

    const recentMessages =
      conversation.messages.slice(-20);

    const aiMessages =
      recentMessages.map((item) => ({
        role:
          item.role === "assistant"
            ? "model"
            : "user",

        parts: [
          {
            text: item.content,
          },
        ],
      }));

    // ====================================
    // Streaming Response Headers
    // ====================================

    res.setHeader(
      "Content-Type",
      "text/event-stream"
    );

    res.setHeader(
      "Cache-Control",
      "no-cache, no-transform"
    );

    res.setHeader(
      "Connection",
      "keep-alive"
    );

    res.setHeader(
      "X-Accel-Buffering",
      "no"
    );

    res.flushHeaders();

    try {
      // ====================================
      // Generate AI Response
      // ====================================

      const responseStream =
        await generateAIResponseStream(
          aiMessages
        );

      // ====================================
      // Collect Complete AI Response
      // ====================================

      let completeResponse = "";

      // ====================================
      // Stream Gemini Chunks
      // ====================================

      for await (
        const chunk of responseStream
      ) {
        const text = chunk.text;

        if (!text) {
          continue;
        }

        completeResponse += text;

        res.write(
          `data: ${JSON.stringify({
            type: "text",
            text,
          })}\n\n`
        );
      }

      // ====================================
      // Save Complete AI Response
      // ====================================

      if (completeResponse.trim()) {
        conversation.messages.push({
          role: "assistant",
          content: completeResponse,
        });

        // ====================================
        // Update Conversation Title
        // ====================================

        if (
          conversation.title ===
          "New AI Chat"
        ) {
          conversation.title =
            message.trim().slice(0, 80) ||
            "New AI Chat";
        }

        await conversation.save();
      }

      // ====================================
      // Stream Complete Event
      // ====================================

      res.write(
        `data: ${JSON.stringify({
          type: "done",
        })}\n\n`
      );

      res.end();
    } catch (error) {
      console.error(
        "AI streaming error:",
        error?.message || error
      );

      // ====================================
      // Determine Error Information
      // ====================================

      const statusCode =
        error?.statusCode || 500;

      const errorMessage =
        error?.message ||
        "Unable to generate AI response";

      // ====================================
      // Send SSE Error Event
      // ====================================

      res.write(
        `data: ${JSON.stringify({
          type: "error",
          statusCode,
          message: errorMessage,
        })}\n\n`
      );

      res.end();
    }
  }
);