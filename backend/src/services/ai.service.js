import { GoogleGenAI } from "@google/genai";

// ====================================
// Gemini Configuration
// ====================================

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ====================================
// Generate AI Response Stream
// ====================================

export const generateAIResponseStream = async (
  message
) => {
  try {
    const responseStream =
      await ai.models.generateContentStream({
        model: "gemini-3.5-flash",
        contents: message,
        config: {
          systemInstruction:
            "You are DevPulse AI, a helpful developer-focused AI assistant. " +
            "Help users understand programming concepts, debug errors, review code, " +
            "suggest projects, and improve their development skills. " +
            "Give clear, practical, accurate answers. " +

            // ====================================
            // Response Formatting Rules
            // ====================================

            "Use Markdown to make responses easy to read. " +
            "Use headings when appropriate. " +
            "Use bullet lists when presenting multiple unordered items. " +
            "When the user asks for a specific number of points, ALWAYS use a " +
            "Markdown numbered list with 1., 2., 3., etc. " +
            "Do not represent numbered points as separate paragraphs. " +
            "Use fenced Markdown code blocks for multi-line code examples. " +
            "Use inline code formatting for variable names, functions, commands, " +
            "file names, routes, and short code snippets. " +
            "Keep explanations concise unless the user asks for detailed information.",
        },
      });

    return responseStream;
  } catch (error) {
    console.error(
      "Gemini API error:",
      error?.message || error
    );

    throw new Error(
      "Unable to generate AI response"
    );
  }
};