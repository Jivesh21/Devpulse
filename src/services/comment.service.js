import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import ApiError from "../utils/ApiError.js";

// ====================================
// Create Comment
// ====================================
export const createCommentService = async (
  postId,
  userId,
  content
) => {
  if (!content?.trim()) {
    throw new ApiError(400, "Comment content is required");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const comment = await Comment.create({
    content,
    author: userId,
    post: postId,
  });

  return await Comment.findById(comment._id)
    .populate(
      "author",
      "fullName username avatar"
    );
};

// ====================================
// Get Comments
// ====================================
export const getCommentsService = async (
  postId,
  page = 1,
  limit = 10
) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const skip = (page - 1) * limit;

  const comments = await Comment.find({
    post: postId,
  })
    .populate(
      "author",
      "fullName username avatar"
    )
    .sort({
      createdAt: -1,
    })
    .skip(skip)
    .limit(Number(limit));

  const totalComments =
    await Comment.countDocuments({
      post: postId,
    });

  return {
    comments,
    totalComments,
    currentPage: Number(page),
    totalPages: Math.ceil(totalComments / limit),
  };
};

// ====================================
// Update Comment
// ====================================
export const updateCommentService = async (
  commentId,
  userId,
  content
) => {
  if (!content?.trim()) {
    throw new ApiError(400, "Comment content is required");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.author.toString() !== userId.toString()) {
    throw new ApiError(
      403,
      "You are not allowed to edit this comment"
    );
  }

  comment.content = content;
  comment.isEdited = true;

  await comment.save();

  return await Comment.findById(comment._id)
    .populate(
      "author",
      "fullName username avatar"
    );
};
// ====================================
// Delete Comment
// ====================================
export const deleteCommentService = async (
  commentId,
  userId
) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.author.toString() !== userId.toString()) {
    throw new ApiError(
      403,
      "You are not allowed to delete this comment"
    );
  }

  await Comment.findByIdAndDelete(commentId);

  return {
    deleted: true,
  };
};
// ====================================
// Comment Count
// ====================================
export const getCommentCountService = async (
  postId
) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const commentCount =
    await Comment.countDocuments({
      post: postId,
    });

  return {
    commentCount,
  };
};