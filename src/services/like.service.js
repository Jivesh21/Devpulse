import Like from "../models/like.model.js";
import Post from "../models/post.model.js";
import ApiError from "../utils/ApiError.js";

// ====================================
// Toggle Like
// ====================================
export const toggleLikeService = async (
  postId,
  userId
) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const existingLike = await Like.findOne({
    post: postId,
    user: userId,
  });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);

    return {
      liked: false,
      message: "Post unliked successfully",
    };
  }

  await Like.create({
    post: postId,
    user: userId,
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