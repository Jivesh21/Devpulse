import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  toggleBookmarkService,
  getBookmarkedPostsService,
  getBookmarkStatusService,
} from "../services/bookmark.service.js";

// ====================================
// Toggle Bookmark
// ====================================
export const toggleBookmark = asyncHandler(async (req, res) => {
  const result = await toggleBookmarkService(
    req.user._id,
    req.params.postId
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      result.bookmarked
        ? "Post bookmarked successfully"
        : "Bookmark removed successfully"
    )
  );
});

// ====================================
// Get Bookmarked Posts
// ====================================
export const getBookmarkedPosts = asyncHandler(async (req, res) => {
  const bookmarks = await getBookmarkedPostsService(
    req.user._id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      bookmarks,
      "Bookmarked posts fetched successfully"
    )
  );
});

// ====================================
// Get Bookmark Status
// ====================================
export const getBookmarkStatus = asyncHandler(async (req, res) => {
  const status = await getBookmarkStatusService(
    req.user._id,
    req.params.postId
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      status,
      "Bookmark status fetched successfully"
    )
  );
});