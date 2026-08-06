import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  toggleLikeService,
  getLikeCountService,
  getLikeStatusService,
  getLikedUsersService,
} from "../services/like.service.js";

// ====================================
// Toggle Like
// ====================================
export const toggleLike = asyncHandler(async (req, res) => {
  const result = await toggleLikeService(
    req.params.postId,
    req.user._id
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
// Get Like Count
// ====================================
export const getLikeCount = asyncHandler(async (req, res) => {
  const result = await getLikeCountService(
    req.params.postId
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Like count fetched successfully"
    )
  );
});

// ====================================
// Get Like Status
// ====================================
export const getLikeStatus = asyncHandler(async (req, res) => {
  const result = await getLikeStatusService(
    req.params.postId,
    req.user._id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Like status fetched successfully"
    )
  );
});

// ====================================
// Get Users Who Liked
// ====================================
export const getLikedUsers = asyncHandler(async (req, res) => {
  const users = await getLikedUsersService(
    req.params.postId
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      users,
      "Liked users fetched successfully"
    )
  );
});