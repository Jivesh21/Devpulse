import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  getTrendingHashtagsService,
  getCommunityAnalyticsService,
} from "../services/analytics.service.js";

// ====================================
// Trending Hashtags
// ====================================
export const getTrendingHashtags =
  asyncHandler(async (req, res) => {
    const hashtags =
      await getTrendingHashtagsService();

    return res.status(200).json(
      new ApiResponse(
        200,
        hashtags,
        "Trending hashtags fetched successfully"
      )
    );
  });
  // ====================================
// Community Analytics
// ====================================
export const getCommunityAnalytics =
  asyncHandler(async (req, res) => {
    const analytics =
      await getCommunityAnalyticsService();

    return res.status(200).json(
      new ApiResponse(
        200,
        analytics,
        "Community analytics fetched successfully"
      )
    );
  });