import asyncHandler from "../utils/asyncHandler.js";

import {
  generateAIResponseStream,
} from "../services/ai.service.js";

// ====================================
// Generate AI Chat Response
// ====================================

export const chatWithAI = asyncHandler(
  async (req, res) => {
    const { message } = req.body;

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
      const responseStream =
        await generateAIResponseStream(message);

      // ====================================
      // Stream Gemini Chunks
      // ====================================

      for await (const chunk of responseStream) {
        const text = chunk.text;

        if (!text) {
          continue;
        }

        res.write(
          `data: ${JSON.stringify({
            type: "text",
            text,
          })}\n\n`
        );
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
      // Stream Error Event
      // ====================================

      res.write(
        `data: ${JSON.stringify({
          type: "error",
          message:
            "Unable to generate AI response",
        })}\n\n`
      );

      res.end();
    }
  }
);