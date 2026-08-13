import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

import AIUsage from "../models/aiUsage.model.js";

// ====================================
// AI Daily Usage Limit
// ====================================

const DAILY_AI_LIMIT = Number(
  process.env.AI_DAILY_LIMIT || 5
);

// ====================================
// Check AI Usage
// ====================================

export const checkAIUsage = asyncHandler(
  async (req, res, next) => {
    const userId = req.user._id;
    const today = new Date();

    // ====================================
    // Find User Usage
    // ====================================

    let usage = await AIUsage.findOne({
      user: userId,
    });

    // ====================================
    // Create Usage Record
    // ====================================

    if (!usage) {
      usage = await AIUsage.create({
        user: userId,
        date: today,
        requestCount: 0,
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
      });
    }

    // ====================================
    // Check Usage Date
    // ====================================

    const usageDate =
      new Date(usage.date);

    const sameDay =
      usageDate.getFullYear() ===
        today.getFullYear() &&
      usageDate.getMonth() ===
        today.getMonth() &&
      usageDate.getDate() ===
        today.getDate();

    // ====================================
    // Reset Daily Usage
    // ====================================

    if (!sameDay) {
      usage.date = today;
      usage.requestCount = 0;
      usage.inputTokens = 0;
      usage.outputTokens = 0;
      usage.totalTokens = 0;

      await usage.save();
    }

    // ====================================
    // Check Daily Request Limit
    // ====================================

    if (
      usage.requestCount >=
      DAILY_AI_LIMIT
    ) {
      throw new ApiError(
        429,
        `Daily AI usage limit reached. You can send up to ${DAILY_AI_LIMIT} successful AI messages per day.`
      );
    }

    // ====================================
    // Continue
    // ====================================
    
    // IMPORTANT:
    // We do NOT increment requestCount here.
    //
    // The controller will update usage only
    // after Gemini successfully generates a response.

    next();
  }
);