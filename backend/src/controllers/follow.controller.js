import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  toggleFollowService,
  getFollowersCountService,
  getFollowingCountService,
  getFollowStatusService,
  getFollowersService,
  getFollowingService,
} from "../services/follow.service.js";

// ====================================
// Toggle Follow
// ====================================
export const toggleFollow = asyncHandler(async (req, res) => {
  const result = await toggleFollowService(
    req.user._id,
    req.params.userId
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      result.message
    )
  );
});

// ====================================
// Get Followers Count
// ====================================
export const getFollowersCount = asyncHandler(async (req, res) => {
  const result = await getFollowersCountService(
    req.params.userId
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Followers count fetched successfully"
    )
  );
});

// ====================================
// Get Following Count
// ====================================
export const getFollowingCount = asyncHandler(async (req, res) => {
  const result = await getFollowingCountService(
    req.params.userId
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Following count fetched successfully"
    )
  );
});

// ====================================
// Get Follow Status
// ====================================
export const getFollowStatus = asyncHandler(async (req, res) => {
  const result = await getFollowStatusService(
    req.user._id,
    req.params.userId
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Follow status fetched successfully"
    )
  );
});

// ====================================
// Get Followers List
// ====================================
export const getFollowers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const result = await getFollowersService(
    req.params.userId,
    page,
    limit
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Followers fetched successfully"
    )
  );
});

// ====================================
// Get Following List
// ====================================
export const getFollowing = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const result = await getFollowingService(
    req.params.userId,
    page,
    limit
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Following fetched successfully"
    )
  );
});