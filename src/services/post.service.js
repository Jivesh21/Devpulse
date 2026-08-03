import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import getPagination from "../utils/pagination.js";
// ====================================
// Create Post
// ====================================
export const createPostService = async (
  userId,
  content,
  imageLocalPath
) => {
  let imageUrl = "";

  // Upload image if provided
  if (imageLocalPath) {
    const uploadedImage = await uploadOnCloudinary(imageLocalPath);

    if (!uploadedImage) {
      throw new ApiError(500, "Failed to upload image");
    }

    imageUrl = uploadedImage.secure_url;
  }

  // Prevent empty posts
  if (!content?.trim() && !imageUrl) {
    throw new ApiError(
      400,
      "Post must contain either content or an image"
    );
  }

  // Extract hashtags
  const hashtags = content
    ? [
        ...new Set(
          content.match(/#\w+/g)?.map((tag) =>
            tag.substring(1).toLowerCase()
          ) || []
        ),
      ]
    : [];

  // Create post
  const post = await Post.create({
    author: userId,
    content: content?.trim() || "",
    image: imageUrl,
    hashtags,
  });

  return await Post.findById(post._id).populate(
    "author",
    "fullName username avatar"
  );
  
};
// ====================================
// Get All Posts (Paginated)
// ====================================
// ====================================
// Get All Posts (Paginated)
// ====================================
export const getAllPostsService = async (
  page = 1,
  limit = 10
) => {
  const {
    currentPage,
    perPage,
    skip,
  } = getPagination(page, limit);

  const totalPosts = await Post.countDocuments();

  const posts = await Post.find()
    .populate(
      "author",
      "fullName username avatar"
    )
    .sort({
      createdAt: -1,
    })
    .skip(skip)
    .limit(perPage);

  return {
    posts,
    currentPage,
    perPage,
    totalPosts,
    totalPages: Math.ceil(
      totalPosts / perPage
    ),
    hasNextPage:
      currentPage * perPage < totalPosts,
    hasPrevPage:
      currentPage > 1,
  };
};
// ====================================
// Get Single Post
// ====================================
export const getPostByIdService = async (postId) => {
  const post = await Post.findById(postId).populate(
    "author",
    "fullName username avatar"
  );

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  return post;
};
// ====================================
// Update Post
// ====================================
export const updatePostService = async (
  postId,
  userId,
  content,
  imageLocalPath
) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Authorization
  if (post.author.toString() !== userId.toString()) {
    throw new ApiError(
      403,
      "You are not authorized to update this post"
    );
  }

  let imageUrl = post.image;

  // Upload new image if provided
  if (imageLocalPath) {
    const uploadedImage = await uploadOnCloudinary(
      imageLocalPath
    );

    if (!uploadedImage) {
      throw new ApiError(500, "Failed to upload image");
    }

    imageUrl = uploadedImage.secure_url;
  }

  const updatedContent =
    content !== undefined
      ? content.trim()
      : post.content;

  if (!updatedContent && !imageUrl) {
    throw new ApiError(
      400,
      "Post must contain either content or an image"
    );
  }

  post.content = updatedContent;
  post.image = imageUrl;
  post.hashtags = updatedContent
    ? [
        ...new Set(
          updatedContent
            .match(/#\w+/g)
            ?.map((tag) =>
              tag.substring(1).toLowerCase()
            ) || []
        ),
      ]
    : [];

  post.isEdited = true;

  await post.save();

  return await Post.findById(post._id).populate(
    "author",
    "fullName username avatar"
  );
};
// ====================================
// Delete Post
// ====================================
export const deletePostService = async (
  postId,
  userId
) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Authorization
  if (post.author.toString() !== userId.toString()) {
    throw new ApiError(
      403,
      "You are not authorized to delete this post"
    );
  }

  await Post.findByIdAndDelete(postId);

  return;
};
// ====================================
// Get Posts By Username
// ====================================
export const getUserPostsService = async (username) => {
  const user = await User.findOne({
    username: username.toLowerCase(),
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const posts = await Post.find({
    author: user._id,
  })
    .populate(
      "author",
      "fullName username avatar"
    )
    .sort({
      createdAt: -1,
    });

  return posts;
};