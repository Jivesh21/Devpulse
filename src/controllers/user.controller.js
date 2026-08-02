import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  updateProfileService,
  getUserProfileService,
  updateAvatarService,
  updateCoverImageService,
} from "../services/user.service.js";

// ====================================
// Update User Profile
// ====================================
export const updateProfile = asyncHandler(async (req, res) => {
  const updatedUser = await updateProfileService(
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
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await getUserProfileService(req.params.username);

  return res.status(200).json(
    new ApiResponse(
      200,
      user,
      "Profile fetched successfully"
    )
  );
});

// ====================================
// Update Avatar
// ====================================
export const updateAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  const updatedUser = await updateAvatarService(
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
// Update Cover Image
// ====================================
export const updateCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  const updatedUser = await updateCoverImageService(
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