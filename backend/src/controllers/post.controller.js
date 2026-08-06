import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  createPostService,
  getAllPostsService,
  getPostByIdService,
  updatePostService,
  deletePostService,
  getUserPostsService,
} from "../services/post.service.js";

// ====================================
// Create Post
// ====================================
export const createPost = asyncHandler(async (req, res) => {
  const content = req.body.content;
  const imageLocalPath = req.file?.path;

  const post = await createPostService(
    req.user._id,
    content,
    imageLocalPath
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      post,
      "Post created successfully"
    )
  );
});

// ====================================
// Get All Posts
// ====================================
export const getAllPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const result = await getAllPostsService(page, limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Posts fetched successfully"
    )
  );
});

// ====================================
// Get Single Post
// ====================================
export const getPostById = asyncHandler(async (req, res) => {
  const post = await getPostByIdService(req.params.postId);

  return res.status(200).json(
    new ApiResponse(
      200,
      post,
      "Post fetched successfully"
    )
  );
});

// ====================================
// Update Post
// ====================================
export const updatePost = asyncHandler(async (req, res) => {
  const content = req.body.content;
  const imageLocalPath = req.file?.path;

  const post = await updatePostService(
    req.params.postId,
    req.user._id,
    content,
    imageLocalPath
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      post,
      "Post updated successfully"
    )
  );
});

// ====================================
// Delete Post
// ====================================
export const deletePost = asyncHandler(async (req, res) => {
  await deletePostService(
    req.params.postId,
    req.user._id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      null,
      "Post deleted successfully"
    )
  );
});

// ====================================
// Get User Posts
// ====================================
export const getUserPosts = asyncHandler(async (req, res) => {
  const posts = await getUserPostsService(
    req.params.username
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      posts,
      "User posts fetched successfully"
    )
  );
});