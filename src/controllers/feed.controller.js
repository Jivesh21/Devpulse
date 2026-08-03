import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import { getFeedService } from "../services/feed.service.js";

// ====================================
// Get User Feed
// ====================================
export const getFeed = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const result = await getFeedService(
    req.user._id,
    page,
    limit
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Feed fetched successfully"
    )
  );
});