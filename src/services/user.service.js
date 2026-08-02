import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// ====================================
// Update User Profile
// ====================================
export const updateProfileService = async (userId, profileData) => {
  const {
    bio,
    skills,
    github,
    linkedin,
    website,
  } = profileData;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      bio,
      skills,
      github,
      linkedin,
      website,
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password -refreshToken");

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return updatedUser;
};

// ====================================
// Get Public User Profile
// ====================================
export const getUserProfileService = async (username) => {
  const user = await User.findOne({
    username: username.toLowerCase(),
  }).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

// ====================================
// Update Avatar
// ====================================
export const updateAvatarService = async (
  userId,
  avatarLocalPath
) => {
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar image is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(500, "Failed to upload avatar");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      avatar: avatar.secure_url,
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return updatedUser;
};

// ====================================
// Update Cover Image
// ====================================
export const updateCoverImageService = async (
  userId,
  coverImageLocalPath
) => {
  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image is required");
  }

  const coverImage = await uploadOnCloudinary(
    coverImageLocalPath
  );

  if (!coverImage) {
    throw new ApiError(500, "Failed to upload cover image");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      coverImage: coverImage.secure_url,
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return updatedUser;
};