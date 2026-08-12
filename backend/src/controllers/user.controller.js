import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  updateProfileService,
  getUserProfileService,
  getCurrentUserService,
  getSuggestedDevelopersService,
  searchUsersService,
  updateAvatarService,
  updateCoverImageService,
  removeAvatarService,
  removeCoverImageService,
} from "../services/user.service.js";

// ====================================
// Update User Profile
// ====================================

export const updateProfile =
  asyncHandler(async (req, res) => {
    const updatedUser =
      await updateProfileService(
        req.user._id,
        req.body
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        updatedUser,
        "Profile updated successfully"
      )
    );
  });

// ====================================
// Get Public User Profile
// ====================================

export const getUserProfile =
  asyncHandler(async (req, res) => {
    const user =
      await getUserProfileService(
        req.params.username
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        user,
        "Profile fetched successfully"
      )
    );
  });

// ====================================
// Search Users
// ====================================

export const searchUsers =
  asyncHandler(async (req, res) => {
    const { q } = req.query;

    const users =
      await searchUsersService(q);

    return res.status(200).json(
      new ApiResponse(
        200,
        users,
        "Users fetched successfully"
      )
    );
  });

// ====================================
// Update Avatar
// ====================================

export const updateAvatar =
  asyncHandler(async (req, res) => {
    const avatarLocalPath =
      req.file?.path;

    const updatedUser =
      await updateAvatarService(
        req.user._id,
        avatarLocalPath
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        updatedUser,
        "Avatar updated successfully"
      )
    );
  });

// ====================================
// Remove Avatar
// ====================================

export const removeAvatar =
  asyncHandler(async (req, res) => {
    const updatedUser =
      await removeAvatarService(
        req.user._id
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        updatedUser,
        "Avatar removed successfully"
      )
    );
  });

// ====================================
// Update Cover Image
// ====================================

export const updateCoverImage =
  asyncHandler(async (req, res) => {
    const coverImageLocalPath =
      req.file?.path;

    const updatedUser =
      await updateCoverImageService(
        req.user._id,
        coverImageLocalPath
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        updatedUser,
        "Cover image updated successfully"
      )
    );
  });

// ====================================
// Remove Cover Image
// ====================================

export const removeCoverImage =
  asyncHandler(async (req, res) => {
    const updatedUser =
      await removeCoverImageService(
        req.user._id
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        updatedUser,
        "Cover image removed successfully"
      )
    );
  });

// ====================================
// Get Current User
// ====================================

export const getCurrentUser =
  asyncHandler(async (req, res) => {
    const user =
      await getCurrentUserService(
        req.user._id
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        user,
        "Current user fetched successfully"
      )
    );
  });

// ====================================
// Suggested Developers
// ====================================

export const getSuggestedDevelopers =
  asyncHandler(async (req, res) => {
    const users =
      await getSuggestedDevelopersService(
        req.user._id
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        users,
        "Suggested developers fetched successfully"
      )
    );
  });