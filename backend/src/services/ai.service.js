import { GoogleGenAI } from "@google/genai";

// ====================================
// Gemini Configuration
// ====================================

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ====================================
// Generate AI Response
// ====================================

export const generateAIResponse = async (message) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: message,
      config: {
        systemInstruction:
          "You are DevPulse AI, a helpful developer-focused AI assistant. " +
          "Help users understand programming concepts, debug errors, review code, " +
          "suggest projects, and improve their development skills. " +
          "Give clear, practical, accurate answers and explain reasoning when useful.",
      },
    });

    return response.text;
  } catch (error) {
    console.error(
      "Gemini API error:",
      error?.message || error
    );

    throw new Error("Unable to generate AI response");
  }
};