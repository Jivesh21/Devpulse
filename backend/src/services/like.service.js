import Like from "../models/like.model.js";
import Post from "../models/post.model.js";
import ApiError from "../utils/ApiError.js";
import { createNotificationService } from "./notification.service.js";

// ====================================
// Toggle Like
// ====================================
export const toggleLikeService = async (postId, userId) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const existingLike = await Like.findOne({
    post: postId,
    user: userId,
  });

  // Unlike
  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);

    return {
      liked: false,
      message: "Post unliked successfully",
    };
  }

  // Create Like
  await Like.create({
    post: postId,
    user: userId,
  });

  // ====================================
  // Create Notification Automatically
  // ====================================
  await createNotificationService({
    recipient: post.author,
    sender: userId,
    type: "like",
    post: postId,
  });

  return {
    liked: true,
    message: "Post liked successfully",
  };
};

// ====================================
// Get Like Count
// ====================================
export const getLikeCountService = async (postId) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const likeCount = await Like.countDocuments({
    post: postId,
  });

  return {
    likeCount,
  };
};

// ====================================
// Get Like Status
// ====================================
export const getLikeStatusService = async (postId, userId) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const like = await Like.findOne({
    post: postId,
    user: userId,
  });

  return {
    isLiked: !!like,
  };
};

// ====================================
// Get Users Who Liked
// ====================================
export const getLikedUsersService = async (postId) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const likes = await Like.find({
    post: postId,
  }).populate(
    "user",
    "fullName username avatar"
  );

  return likes.map((like) => like.user);
};