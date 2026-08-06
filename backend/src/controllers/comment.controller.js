import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  createCommentService,
  getCommentsService,
  updateCommentService,
  deleteCommentService,
  getCommentCountService,
} from "../services/comment.service.js";

// ====================================
// Create Comment
// ====================================
export const createComment = asyncHandler(async (req, res) => {
  const comment = await createCommentService(
    req.params.postId,
    req.user._id,
    req.body.content
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      comment,
      "Comment created successfully"
    )
  );
});

// ====================================
// Get Comments
// ====================================
export const getComments = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const result = await getCommentsService(
    req.params.postId,
    page,
    limit
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Comments fetched successfully"
    )
  );
});

// ====================================
// Update Comment
// ====================================
export const updateComment = asyncHandler(async (req, res) => {
  const comment = await updateCommentService(
    req.params.commentId,
    req.user._id,
    req.body.content
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      comment,
      "Comment updated successfully"
    )
  );
});

// ====================================
// Delete Comment
// ====================================
export const deleteComment = asyncHandler(async (req, res) => {
  const result = await deleteCommentService(
    req.params.commentId,
    req.user._id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Comment deleted successfully"
    )
  );
});

// ====================================
// Get Comment Count
// ====================================
export const getCommentCount = asyncHandler(async (req, res) => {
  const result = await getCommentCountService(
    req.params.postId
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Comment count fetched successfully"
    )
  );
});